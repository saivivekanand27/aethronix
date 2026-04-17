import { useState, useCallback } from 'react'
import { ScanData, generateScanData } from '../data/mockData'

interface FetchState {
  data: ScanData | null
  loading: boolean
  error: string | null
}

export function useMockFetch() {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchData = useCallback((domain: string) => {
    setState({ data: null, loading: true, error: null })
    setTimeout(() => {
      setState({ data: generateScanData(domain || 'example.com'), loading: false, error: null })
    }, 1600)
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, fetchData, reset }
}
