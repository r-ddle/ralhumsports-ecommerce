import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { getSecurityHeaders } from '@/lib/response-filter'
import type { Customer } from '@/payload-types' // Import the main Customer type

// Define PayloadError type for error narrowing
type PayloadError = Error & {
  status?: number
  data?: { field?: string; message?: string }[]
}

// Type for the incoming request data for creating/updating a customer
interface CustomerInputData {
  name: string
  email: string
  phone: string // Corresponds to primaryPhone
  secondaryPhone?: string
  address?: { // Structure for a single address input
    street: string
    city: string
    postalCode: string
    province: string
    type?: 'home' | 'office' | 'other' // Optional, defaults to home
    isDefault?: boolean // Optional, defaults based on logic
  }
  preferredLanguage?: 'english' | 'sinhala' | 'tamil' // From Customer collection
  marketingOptIn?: boolean
}


export const POST = withRateLimit(rateLimitConfigs.strict, async (request: NextRequest) => {
  const payload = await getPayload({ config })
  let requestData: CustomerInputData;

  try {
    requestData = await request.json();
  } catch (e) {
    payload.logger.error({ msg: 'Invalid JSON in customer POST request body', err: e });
    return NextResponse.json(
      { success: false, error: 'Invalid request format. Expected JSON.' },
      { status: 400, headers: getSecurityHeaders() },
    );
  }

  const {
    name,
    email,
    phone, // This is primaryPhone
    secondaryPhone,
    address: inputAddress, // Renamed to avoid conflict with Customer's addresses array
    preferredLanguage = 'english',
    marketingOptIn = true,
  } = requestData;

  // Basic validation
  if (!name || !email || !phone) {
    return NextResponse.json(
      { success: false, error: 'Name, email, and primary phone are required.' },
      { status: 400, headers: getSecurityHeaders() },
    );
  }
  // Add more specific validation for email format, phone format etc. if needed (e.g. with Zod)

  try {
    const existingCustomers = await payload.find({
      collection: 'customers',
      where: { email: { equals: email } },
      limit: 1,
    });

    let customerDoc: Customer;

    // Prepare the address structure according to Payload's Customer type
    const newAddressObject = inputAddress ? {
      type: inputAddress.type || 'home',
      address: `${inputAddress.street}, ${inputAddress.city}, ${inputAddress.postalCode}, ${inputAddress.province}`,
      isDefault: inputAddress.isDefault !== undefined ? inputAddress.isDefault : true, // Default new address to true, or handle logic
    } : null;


    if (existingCustomers.docs.length > 0) {
      customerDoc = existingCustomers.docs[0];
      const updatePayload: Partial<Customer> = {};

      if (name && name !== customerDoc.name) updatePayload.name = name;
      if (phone && phone !== customerDoc.primaryPhone) updatePayload.primaryPhone = phone;
      if (secondaryPhone && secondaryPhone !== customerDoc.secondaryPhone) updatePayload.secondaryPhone = secondaryPhone;

      // Address update logic: append if new, or could be more complex (e.g., update existing by ID)
      let currentAddresses = customerDoc.addresses ? [...customerDoc.addresses] : [];
      if (newAddressObject) {
        const addressExists = currentAddresses.some(
          (addr) => addr.address === newAddressObject.address && addr.type === newAddressObject.type
        );
        if (!addressExists) {
           // If new address is default, make others not default
          if (newAddressObject.isDefault) {
            currentAddresses = currentAddresses.map(addr => ({ ...addr, isDefault: false }));
          }
          currentAddresses.push(newAddressObject);
          updatePayload.addresses = currentAddresses;
        } else if (newAddressObject.isDefault) {
            // If existing address is now marked as default
            let updated = false;
            currentAddresses = currentAddresses.map(addr => {
                if(addr.address === newAddressObject.address && addr.type === newAddressObject.type) {
                    if (!addr.isDefault) updated = true;
                    return { ...addr, isDefault: true };
                }
                return { ...addr, isDefault: false };
            });
            if(updated) updatePayload.addresses = currentAddresses;
        }
      }

      if (preferredLanguage && (!customerDoc.preferences?.language || preferredLanguage !== customerDoc.preferences.language)) {
        updatePayload.preferences = { ...customerDoc.preferences, language: preferredLanguage };
      }
      if (marketingOptIn !== undefined && (!customerDoc.preferences?.marketingOptIn || marketingOptIn !== customerDoc.preferences.marketingOptIn)) {
        updatePayload.preferences = { ...(updatePayload.preferences || customerDoc.preferences), marketingOptIn };
      }


      if (Object.keys(updatePayload).length > 0) {
        customerDoc = await payload.update({
          collection: 'customers',
          id: customerDoc.id,
          data: updatePayload,
        });
      }
    } else {
      // Create new customer
      const createData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        email,
        primaryPhone: phone,
        secondaryPhone: secondaryPhone || null,
        addresses: newAddressObject ? [newAddressObject] : [],
        preferences: {
          communicationMethod: 'whatsapp', // Default
          language: preferredLanguage,
          marketingOptIn,
        },
        whatsapp: { // Default
          isVerified: false,
        },
        status: 'active', // Default
        customerType: 'regular', // Default
        // orderStats are typically managed by hooks, initialize if needed
        orderStats: {
            totalOrders: 0,
            totalSpent: 0,
            // other stats can be null or 0
        }
      };
      customerDoc = await payload.create({
        collection: 'customers',
        data: createData,
      });
    }

    // Return a subset of customer data, or the full object if appropriate for the use case
    const responseData = {
      id: customerDoc.id,
      name: customerDoc.name,
      email: customerDoc.email,
      phone: customerDoc.primaryPhone,
      addresses: customerDoc.addresses,
      preferences: customerDoc.preferences,
      // Include other fields as needed by the client
    };

    return NextResponse.json(
      { success: true, data: responseData },
      { status: existingCustomers.docs.length > 0 ? 200 : 201, headers: getSecurityHeaders() },
    );
  } catch (error) {
    const err = error as PayloadError;
    payload.logger.error({ msg: 'Error creating/updating customer', requestData, err });
    let userMessage = 'Failed to create or update customer.';
    if (err.data && err.data[0]?.message) {
        userMessage = `Validation Error: ${err.data[0].message} for field ${err.data[0].field}`;
    } else if (err.message?.includes('duplicate key value violates unique constraint')) {
        userMessage = 'A customer with this email or phone already exists.';
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: err.status || 500, headers: getSecurityHeaders() },
    );
  }
});
