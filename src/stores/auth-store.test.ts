import { act, renderHook } from '@testing-library/react'
import * as cookies from '@/lib/cookies'
import { useAuthStore } from './auth-store'

// Mock the cookies module
vi.mock('@/lib/cookies', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  removeCookie: vi.fn(),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    const { auth } = useAuthStore.getState()
    act(() => {
      auth.reset()
    })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthStore())
    expect(result.current.auth.user).toBeNull()
    expect(result.current.auth.accessToken).toBe('')
  })

  it('should set user', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = {
      accountNo: '123',
      email: 'test@example.com',
      role: ['user'],
      exp: 1234567890,
    }

    act(() => {
      result.current.auth.setUser(mockUser)
    })

    expect(result.current.auth.user).toEqual(mockUser)
  })

  it('should set access token and save to cookie', () => {
    const { result } = renderHook(() => useAuthStore())
    const token = 'test-token'

    act(() => {
      result.current.auth.setAccessToken(token)
    })

    expect(result.current.auth.accessToken).toBe(token)
    expect(cookies.setCookie).toHaveBeenCalledWith('thisisjustarandomstring', JSON.stringify(token))
  })

  it('should reset access token and remove cookie', () => {
    const { result } = renderHook(() => useAuthStore())

    // First set it
    act(() => {
      result.current.auth.setAccessToken('token')
    })

    // Then reset it
    act(() => {
      result.current.auth.resetAccessToken()
    })

    expect(result.current.auth.accessToken).toBe('')
    expect(cookies.removeCookie).toHaveBeenCalledWith('thisisjustarandomstring')
  })

  it('should reset entire state', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser = {
      accountNo: '123',
      email: 'test@example.com',
      role: ['user'],
      exp: 1234567890,
    }

    act(() => {
      result.current.auth.setUser(mockUser)
      result.current.auth.setAccessToken('token')
    })

    act(() => {
      result.current.auth.reset()
    })

    expect(result.current.auth.user).toBeNull()
    expect(result.current.auth.accessToken).toBe('')
    expect(cookies.removeCookie).toHaveBeenCalledWith('thisisjustarandomstring')
  })
})
