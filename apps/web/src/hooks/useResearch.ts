"use client"

import { useState, useEffect } from 'react'
import { apiService, type ResearchResponse } from '../lib/api'

interface UseResearchResult {
  data: ResearchResponse | null
  loading: boolean
  error: string | null
}

export function useAllergenResearch(allergen: string, enabled: boolean = true): UseResearchResult {
  const [data, setData] = useState<ResearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !allergen) {
      return
    }

    let isCancelled = false

    const fetchResearch = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await apiService.searchAllergenInfo(allergen)
        
        if (!isCancelled) {
          setData(result)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch research data')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchResearch()

    return () => {
      isCancelled = true
    }
  }, [allergen, enabled])

  return { data, loading, error }
}

export function useFoodSafetyResearch(
  foodItem: string, 
  allergens: string[], 
  enabled: boolean = true
): UseResearchResult {
  const [data, setData] = useState<ResearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !foodItem || allergens.length === 0) {
      return
    }

    let isCancelled = false

    const fetchResearch = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await apiService.searchFoodSafety(foodItem, allergens)
        
        if (!isCancelled) {
          setData(result)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch research data')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchResearch()

    return () => {
      isCancelled = true
    }
  }, [foodItem, JSON.stringify(allergens), enabled])

  return { data, loading, error }
}

export function useGeneralSearch(query: string, enabled: boolean = true): UseResearchResult {
  const [data, setData] = useState<ResearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !query) {
      return
    }

    let isCancelled = false

    const fetchResearch = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await apiService.generalSearch(query)
        
        if (!isCancelled) {
          setData(result)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch research data')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchResearch()

    return () => {
      isCancelled = true
    }
  }, [query, enabled])

  return { data, loading, error }
}

// Re-export the ResearchResponse type for convenience
export type { ResearchResponse }