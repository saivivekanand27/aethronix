const API_BASE_URL = 'https://4e2a-157-66-153-106.ngrok-free.app'

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
