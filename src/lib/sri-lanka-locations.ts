/**
 * Sri Lankan Cities and Provinces mapping system
 * This provides comprehensive city-to-province mapping for proper address validation
 */

export interface Province {
  id: string
  name: string
  districts: string[]
}

export interface City {
  name: string
  province: string
  district: string
}

// Sri Lankan provinces with their districts
export const provinces: Province[] = [
  {
    id: 'western',
    name: 'Western Province',
    districts: ['Colombo', 'Gampaha', 'Kalutara']
  },
  {
    id: 'central',
    name: 'Central Province',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya']
  },
  {
    id: 'southern',
    name: 'Southern Province',
    districts: ['Galle', 'Matara', 'Hambantota']
  },
  {
    id: 'northern',
    name: 'Northern Province',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu']
  },
  {
    id: 'eastern',
    name: 'Eastern Province',
    districts: ['Trincomalee', 'Batticaloa', 'Ampara']
  },
  {
    id: 'northwestern',
    name: 'North Western Province',
    districts: ['Kurunegala', 'Puttalam']
  },
  {
    id: 'northcentral',
    name: 'North Central Province',
    districts: ['Anuradhapura', 'Polonnaruwa']
  },
  {
    id: 'uva',
    name: 'Uva Province',
    districts: ['Badulla', 'Moneragala']
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa Province',
    districts: ['Ratnapura', 'Kegalle']
  }
]

// Comprehensive city-to-province mapping
export const cities: City[] = [
  // Western Province
  { name: 'Colombo', province: 'Western Province', district: 'Colombo' },
  { name: 'Mount Lavinia', province: 'Western Province', district: 'Colombo' },
  { name: 'Dehiwala', province: 'Western Province', district: 'Colombo' },
  { name: 'Moratuwa', province: 'Western Province', district: 'Colombo' },
  { name: 'Sri Jayawardenepura Kotte', province: 'Western Province', district: 'Colombo' },
  { name: 'Kotte', province: 'Western Province', district: 'Colombo' },
  { name: 'Maharagama', province: 'Western Province', district: 'Colombo' },
  { name: 'Kesbewa', province: 'Western Province', district: 'Colombo' },
  { name: 'Boralesgamuwa', province: 'Western Province', district: 'Colombo' },
  { name: 'Piliyandala', province: 'Western Province', district: 'Colombo' },
  { name: 'Nugegoda', province: 'Western Province', district: 'Colombo' },
  { name: 'Kottawa', province: 'Western Province', district: 'Colombo' },
  { name: 'Pannipitiya', province: 'Western Province', district: 'Colombo' },
  { name: 'Homagama', province: 'Western Province', district: 'Colombo' },
  { name: 'Angoda', province: 'Western Province', district: 'Colombo' },
  { name: 'Kaduwela', province: 'Western Province', district: 'Colombo' },
  { name: 'Malabe', province: 'Western Province', district: 'Colombo' },
  { name: 'Battaramulla', province: 'Western Province', district: 'Colombo' },
  { name: 'Rajagiriya', province: 'Western Province', district: 'Colombo' },
  
  { name: 'Gampaha', province: 'Western Province', district: 'Gampaha' },
  { name: 'Negombo', province: 'Western Province', district: 'Gampaha' },
  { name: 'Katunayake', province: 'Western Province', district: 'Gampaha' },
  { name: 'Kelaniya', province: 'Western Province', district: 'Gampaha' },
  { name: 'Peliyagoda', province: 'Western Province', district: 'Gampaha' },
  { name: 'Wattala', province: 'Western Province', district: 'Gampaha' },
  { name: 'Hendala', province: 'Western Province', district: 'Gampaha' },
  { name: 'Ja-Ela', province: 'Western Province', district: 'Gampaha' },
  { name: 'Kandana', province: 'Western Province', district: 'Gampaha' },
  { name: 'Minuwangoda', province: 'Western Province', district: 'Gampaha' },
  { name: 'Divulapitiya', province: 'Western Province', district: 'Gampaha' },
  { name: 'Nittambuwa', province: 'Western Province', district: 'Gampaha' },
  { name: 'Veyangoda', province: 'Western Province', district: 'Gampaha' },
  { name: 'Kiribathgoda', province: 'Western Province', district: 'Gampaha' },
  { name: 'Ragama', province: 'Western Province', district: 'Gampaha' },
  { name: 'Kadawatha', province: 'Western Province', district: 'Gampaha' },
  
  { name: 'Kalutara', province: 'Western Province', district: 'Kalutara' },
  { name: 'Panadura', province: 'Western Province', district: 'Kalutara' },
  { name: 'Wadduwa', province: 'Western Province', district: 'Kalutara' },
  { name: 'Beruwala', province: 'Western Province', district: 'Kalutara' },
  { name: 'Aluthgama', province: 'Western Province', district: 'Kalutara' },
  { name: 'Bentota', province: 'Western Province', district: 'Kalutara' },
  { name: 'Horana', province: 'Western Province', district: 'Kalutara' },
  { name: 'Bandaragama', province: 'Western Province', district: 'Kalutara' },
  { name: 'Mathugama', province: 'Western Province', district: 'Kalutara' },
  { name: 'Ingiriya', province: 'Western Province', district: 'Kalutara' },

  // Central Province
  { name: 'Kandy', province: 'Central Province', district: 'Kandy' },
  { name: 'Peradeniya', province: 'Central Province', district: 'Kandy' },
  { name: 'Gampola', province: 'Central Province', district: 'Kandy' },
  { name: 'Nawalapitiya', province: 'Central Province', district: 'Kandy' },
  { name: 'Kadugannawa', province: 'Central Province', district: 'Kandy' },
  { name: 'Wattegama', province: 'Central Province', district: 'Kandy' },
  { name: 'Harispattuwa', province: 'Central Province', district: 'Kandy' },
  { name: 'Pathahewaheta', province: 'Central Province', district: 'Kandy' },
  { name: 'Kundasale', province: 'Central Province', district: 'Kandy' },
  { name: 'Akurana', province: 'Central Province', district: 'Kandy' },
  { name: 'Katugastota', province: 'Central Province', district: 'Kandy' },
  
  { name: 'Matale', province: 'Central Province', district: 'Matale' },
  { name: 'Dambulla', province: 'Central Province', district: 'Matale' },
  { name: 'Sigiriya', province: 'Central Province', district: 'Matale' },
  { name: 'Galewela', province: 'Central Province', district: 'Matale' },
  { name: 'Ukuwela', province: 'Central Province', district: 'Matale' },
  { name: 'Rattota', province: 'Central Province', district: 'Matale' },
  { name: 'Pallepola', province: 'Central Province', district: 'Matale' },
  
  { name: 'Nuwara Eliya', province: 'Central Province', district: 'Nuwara Eliya' },
  { name: 'Hatton', province: 'Central Province', district: 'Nuwara Eliya' },
  { name: 'Talawakele', province: 'Central Province', district: 'Nuwara Eliya' },
  { name: 'Bandarawela', province: 'Central Province', district: 'Nuwara Eliya' },
  { name: 'Hapu-Tale', province: 'Central Province', district: 'Nuwara Eliya' },
  { name: 'Maskeliya', province: 'Central Province', district: 'Nuwara Eliya' },
  { name: 'Ginigathena', province: 'Central Province', district: 'Nuwara Eliya' },

  // Southern Province
  { name: 'Galle', province: 'Southern Province', district: 'Galle' },
  { name: 'Hikkaduwa', province: 'Southern Province', district: 'Galle' },
  { name: 'Ambalangoda', province: 'Southern Province', district: 'Galle' },
  { name: 'Elpitiya', province: 'Southern Province', district: 'Galle' },
  { name: 'Bentota', province: 'Southern Province', district: 'Galle' },
  { name: 'Baddegama', province: 'Southern Province', district: 'Galle' },
  { name: 'Karapitiya', province: 'Southern Province', district: 'Galle' },
  { name: 'Unawatuna', province: 'Southern Province', district: 'Galle' },
  { name: 'Koggala', province: 'Southern Province', district: 'Galle' },
  
  { name: 'Matara', province: 'Southern Province', district: 'Matara' },
  { name: 'Weligama', province: 'Southern Province', district: 'Matara' },
  { name: 'Mirissa', province: 'Southern Province', district: 'Matara' },
  { name: 'Kamburupitiya', province: 'Southern Province', district: 'Matara' },
  { name: 'Hakmana', province: 'Southern Province', district: 'Matara' },
  { name: 'Akuressa', province: 'Southern Province', district: 'Matara' },
  { name: 'Deniyaya', province: 'Southern Province', district: 'Matara' },
  { name: 'Dikwella', province: 'Southern Province', district: 'Matara' },
  { name: 'Tangalle', province: 'Southern Province', district: 'Matara' },
  
  { name: 'Hambantota', province: 'Southern Province', district: 'Hambantota' },
  { name: 'Tissamaharama', province: 'Southern Province', district: 'Hambantota' },
  { name: 'Ambalantota', province: 'Southern Province', district: 'Hambantota' },
  { name: 'Kataragama', province: 'Southern Province', district: 'Hambantota' },
  { name: 'Beliatta', province: 'Southern Province', district: 'Hambantota' },
  { name: 'Sooriyawewa', province: 'Southern Province', district: 'Hambantota' },

  // Northern Province
  { name: 'Jaffna', province: 'Northern Province', district: 'Jaffna' },
  { name: 'Point Pedro', province: 'Northern Province', district: 'Jaffna' },
  { name: 'Chavakachcheri', province: 'Northern Province', district: 'Jaffna' },
  { name: 'Nallur', province: 'Northern Province', district: 'Jaffna' },
  { name: 'Kopay', province: 'Northern Province', district: 'Jaffna' },
  
  { name: 'Kilinochchi', province: 'Northern Province', district: 'Kilinochchi' },
  { name: 'Paranthan', province: 'Northern Province', district: 'Kilinochchi' },
  
  { name: 'Mannar', province: 'Northern Province', district: 'Mannar' },
  { name: 'Nanattan', province: 'Northern Province', district: 'Mannar' },
  
  { name: 'Vavuniya', province: 'Northern Province', district: 'Vavuniya' },
  { name: 'Cheddikulam', province: 'Northern Province', district: 'Vavuniya' },
  
  { name: 'Mullaitivu', province: 'Northern Province', district: 'Mullaitivu' },
  { name: 'Oddusuddan', province: 'Northern Province', district: 'Mullaitivu' },

  // Eastern Province
  { name: 'Trincomalee', province: 'Eastern Province', district: 'Trincomalee' },
  { name: 'Kinniya', province: 'Eastern Province', district: 'Trincomalee' },
  { name: 'Mutur', province: 'Eastern Province', district: 'Trincomalee' },
  
  { name: 'Batticaloa', province: 'Eastern Province', district: 'Batticaloa' },
  { name: 'Kalmunai', province: 'Eastern Province', district: 'Batticaloa' },
  { name: 'Eravur', province: 'Eastern Province', district: 'Batticaloa' },
  { name: 'Valachchenai', province: 'Eastern Province', district: 'Batticaloa' },
  
  { name: 'Ampara', province: 'Eastern Province', district: 'Ampara' },
  { name: 'Akkaraipattu', province: 'Eastern Province', district: 'Ampara' },
  { name: 'Sainthamaruthu', province: 'Eastern Province', district: 'Ampara' },

  // North Western Province
  { name: 'Kurunegala', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Kuliyapitiya', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Narammala', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Wariyapola', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Pannala', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Melsiripura', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Giriulla', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Alawwa', province: 'North Western Province', district: 'Kurunegala' },
  { name: 'Bingiriya', province: 'North Western Province', district: 'Kurunegala' },
  
  { name: 'Puttalam', province: 'North Western Province', district: 'Puttalam' },
  { name: 'Chilaw', province: 'North Western Province', district: 'Puttalam' },
  { name: 'Nattandiya', province: 'North Western Province', district: 'Puttalam' },
  { name: 'Wennappuwa', province: 'North Western Province', district: 'Puttalam' },
  { name: 'Marawila', province: 'North Western Province', district: 'Puttalam' },
  { name: 'Dankotuwa', province: 'North Western Province', district: 'Puttalam' },

  // North Central Province
  { name: 'Anuradhapura', province: 'North Central Province', district: 'Anuradhapura' },
  { name: 'Kekirawa', province: 'North Central Province', district: 'Anuradhapura' },
  { name: 'Thambuttegama', province: 'North Central Province', district: 'Anuradhapura' },
  { name: 'Eppawala', province: 'North Central Province', district: 'Anuradhapura' },
  { name: 'Medawachchiya', province: 'North Central Province', district: 'Anuradhapura' },
  { name: 'Horowpothana', province: 'North Central Province', district: 'Anuradhapura' },
  { name: 'Galenbindunuwewa', province: 'North Central Province', district: 'Anuradhapura' },
  
  { name: 'Polonnaruwa', province: 'North Central Province', district: 'Polonnaruwa' },
  { name: 'Kaduruwela', province: 'North Central Province', district: 'Polonnaruwa' },
  { name: 'Hingurakgoda', province: 'North Central Province', district: 'Polonnaruwa' },
  { name: 'Medirigiriya', province: 'North Central Province', district: 'Polonnaruwa' },

  // Uva Province
  { name: 'Badulla', province: 'Uva Province', district: 'Badulla' },
  { name: 'Bandarawela', province: 'Uva Province', district: 'Badulla' },
  { name: 'Ella', province: 'Uva Province', district: 'Badulla' },
  { name: 'Welimada', province: 'Uva Province', district: 'Badulla' },
  { name: 'Haputale', province: 'Uva Province', district: 'Badulla' },
  { name: 'Diyatalawa', province: 'Uva Province', district: 'Badulla' },
  { name: 'Mahiyanganaya', province: 'Uva Province', district: 'Badulla' },
  { name: 'Passara', province: 'Uva Province', district: 'Badulla' },
  
  { name: 'Moneragala', province: 'Uva Province', district: 'Moneragala' },
  { name: 'Wellawaya', province: 'Uva Province', district: 'Moneragala' },
  { name: 'Kataragama', province: 'Uva Province', district: 'Moneragala' },
  { name: 'Buttala', province: 'Uva Province', district: 'Moneragala' },
  { name: 'Bibile', province: 'Uva Province', district: 'Moneragala' },

  // Sabaragamuwa Province
  { name: 'Ratnapura', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Embilipitiya', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Balangoda', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Rakwana', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Pelmadulla', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Eheliyagoda', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Kuruwita', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  { name: 'Godakawela', province: 'Sabaragamuwa Province', district: 'Ratnapura' },
  
  { name: 'Kegalle', province: 'Sabaragamuwa Province', district: 'Kegalle' },
  { name: 'Mawanella', province: 'Sabaragamuwa Province', district: 'Kegalle' },
  { name: 'Warakapola', province: 'Sabaragamuwa Province', district: 'Kegalle' },
  { name: 'Rambukkana', province: 'Sabaragamuwa Province', district: 'Kegalle' },
  { name: 'Galigamuwa', province: 'Sabaragamuwa Province', district: 'Kegalle' },
  { name: 'Dehiowita', province: 'Sabaragamuwa Province', district: 'Kegalle' },
  { name: 'Deraniyagala', province: 'Sabaragamuwa Province', district: 'Kegalle' }
]

// Create a map for fast lookups
const cityToProvinceMap = new Map<string, City>()
cities.forEach(city => {
  // Store both exact match and lowercase for flexible matching
  cityToProvinceMap.set(city.name.toLowerCase(), city)
})

/**
 * Get province for a given city name
 * @param cityName - The city name to look up
 * @returns The province name or null if not found
 */
export function getProvinceForCity(cityName: string): string | null {
  const city = cityToProvinceMap.get(cityName.toLowerCase().trim())
  return city ? city.province : null
}

/**
 * Get all cities for auto-complete suggestions
 * @param query - Search query to filter cities
 * @param limit - Maximum number of suggestions to return
 * @returns Array of city suggestions
 */
export function getCitySuggestions(query: string, limit: number = 10): string[] {
  if (!query.trim()) return []
  
  const searchQuery = query.toLowerCase().trim()
  const matches = cities
    .filter(city => city.name.toLowerCase().includes(searchQuery))
    .slice(0, limit)
    .map(city => city.name)
  
  return matches
}

/**
 * Validate if a city exists in our database
 * @param cityName - The city name to validate
 * @returns Boolean indicating if the city is valid
 */
export function isValidSriLankanCity(cityName: string): boolean {
  return cityToProvinceMap.has(cityName.toLowerCase().trim())
}

/**
 * Get city information including province and district
 * @param cityName - The city name to look up
 * @returns City information or null if not found
 */
export function getCityInfo(cityName: string): City | null {
  return cityToProvinceMap.get(cityName.toLowerCase().trim()) || null
}

/**
 * Get all provinces for dropdown selection
 * @returns Array of provinces
 */
export function getAllProvinces(): Province[] {
  return provinces
}

/**
 * Get cities by province
 * @param provinceName - The province name
 * @returns Array of cities in the province
 */
export function getCitiesByProvince(provinceName: string): City[] {
  return cities.filter(city => city.province === provinceName)
}