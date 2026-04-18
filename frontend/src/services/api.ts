const API_BASE_URL = 'https://aethronix.onrender.com'

export interface AuditResponse {
  domain: string
  audit_results: any[]
  intelligence: any
}

export async function runSecurityAudit(domain: string): Promise<AuditResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/security-audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Security audit failed:', error)
    throw error
  }
}
