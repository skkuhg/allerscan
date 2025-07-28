import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { CustomError } from '../middleware/errorHandler';

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  query: string;
  follow_up_questions?: string[];
  answer?: string;
  images?: string[];
  results: TavilySearchResult[];
  response_time: number;
}

export interface SearchOptions {
  search_depth?: 'basic' | 'advanced';
  include_images?: boolean;
  include_answer?: boolean;
  include_raw_content?: boolean;
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
}

class TavilyService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.tavily.baseUrl,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.tavily.apiKey}`,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`Tavily API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Tavily API request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`Tavily API response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        logger.error('Tavily API response error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  async search(query: string, options: SearchOptions = {}): Promise<TavilyResponse> {
    try {
      const payload = {
        api_key: config.tavily.apiKey,
        query,
        search_depth: options.search_depth || 'basic',
        include_images: options.include_images || false,
        include_answer: options.include_answer || true,
        include_raw_content: options.include_raw_content || false,
        max_results: options.max_results || 5,
        ...(options.include_domains && { include_domains: options.include_domains }),
        ...(options.exclude_domains && { exclude_domains: options.exclude_domains }),
      };

      const response = await this.client.post('/search', payload);
      
      logger.info(`Tavily search completed for query: "${query}"`);
      return response.data;
    } catch (error) {
      logger.error('Tavily search failed:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new CustomError('Invalid Tavily API key', 401);
        }
        if (error.response?.status === 429) {
          throw new CustomError('Tavily API rate limit exceeded', 429);
        }
        if (error.response?.status >= 500) {
          throw new CustomError('Tavily API server error', 502);
        }
      }
      
      throw new CustomError('Failed to perform research search', 500);
    }
  }

  async searchAllergenInfo(allergen: string): Promise<TavilyResponse> {
    const query = `${allergen} allergen food safety information symptoms cross contamination`;
    
    const options: SearchOptions = {
      search_depth: 'advanced',
      include_answer: true,
      max_results: 8,
      include_domains: [
        'mayoclinic.org',
        'webmd.com',
        'healthline.com',
        'allergyuk.org',
        'foodallergy.org',
        'fda.gov',
        'nhs.uk',
        'acaai.org'
      ],
    };

    return this.search(query, options);
  }

  async searchFoodSafety(foodItem: string, allergens: string[]): Promise<TavilyResponse> {
    const allergenList = allergens.join(', ');
    const query = `"${foodItem}" food safety allergens "${allergenList}" ingredients cross contamination`;
    
    const options: SearchOptions = {
      search_depth: 'advanced',
      include_answer: true,
      max_results: 6,
      include_domains: [
        'fda.gov',
        'usda.gov',
        'foodsafety.gov',
        'allergyuk.org',
        'foodallergy.org',
        'mayoclinic.org',
        'webmd.com'
      ],
    };

    return this.search(query, options);
  }

  async searchNutritionalInfo(foodItem: string): Promise<TavilyResponse> {
    const query = `"${foodItem}" nutritional information calories nutrients dietary restrictions vegan vegetarian gluten free`;
    
    const options: SearchOptions = {
      search_depth: 'basic',
      include_answer: true,
      max_results: 5,
      include_domains: [
        'nutritionix.com',
        'cronometer.com',
        'myfitnesspal.com',
        'usda.gov',
        'nutrition.gov',
        'healthline.com'
      ],
    };

    return this.search(query, options);
  }

  async searchAlternatives(foodItem: string, avoidAllergens: string[]): Promise<TavilyResponse> {
    const allergenList = avoidAllergens.join(', ');
    const query = `"${foodItem}" alternatives substitutes free from "${allergenList}" allergen friendly options`;
    
    const options: SearchOptions = {
      search_depth: 'advanced',
      include_answer: true,
      max_results: 8,
      include_domains: [
        'allergyliving.com',
        'verywellhealth.com',
        'foodallergy.org',
        'allergyuk.org',
        'healthline.com',
        'epicurious.com',
        'allrecipes.com'
      ],
    };

    return this.search(query, options);
  }

  async searchRecipes(restrictions: string[]): Promise<TavilyResponse> {
    const restrictionList = restrictions.join(' ');
    const query = `${restrictionList} free recipes safe allergen friendly cooking`;
    
    const options: SearchOptions = {
      search_depth: 'basic',
      include_answer: false,
      max_results: 10,
      include_domains: [
        'allrecipes.com',
        'epicurious.com',
        'foodnetwork.com',
        'simplyrecipes.com',
        'allergyliving.com',
        'glutenfreegoddess.com'
      ],
    };

    return this.search(query, options);
  }
}

export const tavilyService = new TavilyService();