interface ResearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface ResearchResponse {
  query: string;
  follow_up_questions?: string[];
  answer?: string;
  images?: string[];
  results: ResearchResult[];
  response_time: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async searchAllergenInfo(allergen: string): Promise<ResearchResponse & { allergen: string }> {
    const response = await this.fetchApi<ApiResponse<ResearchResponse & { allergen: string }>>(
      `/api/research/allergen/${encodeURIComponent(allergen)}`
    );
    return response.data;
  }

  async searchFoodSafety(foodItem: string, allergens: string[]): Promise<ResearchResponse & { foodItem: string; allergens: string[] }> {
    const response = await this.fetchApi<ApiResponse<ResearchResponse & { foodItem: string; allergens: string[] }>>(
      '/api/research/food-safety',
      {
        method: 'POST',
        body: JSON.stringify({ foodItem, allergens }),
      }
    );
    return response.data;
  }

  async searchNutritionalInfo(foodItem: string): Promise<ResearchResponse & { foodItem: string }> {
    const response = await this.fetchApi<ApiResponse<ResearchResponse & { foodItem: string }>>(
      `/api/research/nutrition/${encodeURIComponent(foodItem)}`
    );
    return response.data;
  }

  async searchAlternatives(foodItem: string, avoidAllergens: string[]): Promise<ResearchResponse & { foodItem: string; avoidAllergens: string[] }> {
    const response = await this.fetchApi<ApiResponse<ResearchResponse & { foodItem: string; avoidAllergens: string[] }>>(
      '/api/research/alternatives',
      {
        method: 'POST',
        body: JSON.stringify({ foodItem, avoidAllergens }),
      }
    );
    return response.data;
  }

  async searchRecipes(restrictions: string[]): Promise<ResearchResponse & { restrictions: string[] }> {
    const response = await this.fetchApi<ApiResponse<ResearchResponse & { restrictions: string[] }>>(
      '/api/research/recipes',
      {
        method: 'POST',
        body: JSON.stringify({ restrictions }),
      }
    );
    return response.data;
  }

  async generalSearch(query: string, options?: { search_depth?: 'basic' | 'advanced'; max_results?: number }): Promise<ResearchResponse> {
    const params = new URLSearchParams({
      query,
      ...(options?.search_depth && { search_depth: options.search_depth }),
      ...(options?.max_results && { max_results: options.max_results.toString() }),
    });

    const response = await this.fetchApi<ApiResponse<ResearchResponse>>(
      `/api/research/search?${params}`
    );
    return response.data;
  }
}

export const apiService = new ApiService();

// Export types for external use
export type { ResearchResponse, ResearchResult };