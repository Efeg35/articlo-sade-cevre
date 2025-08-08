import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Auth from '../Auth'

// Mock Supabase client
const mockSupabaseClient = {
    auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
} as any // eslint-disable-line @typescript-eslint/no-explicit-any

// Mock the Supabase client creation
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabaseClient),
}))

// Mock useSupabaseClient hook
vi.mock('@supabase/auth-helpers-react', async () => {
    const actual = await vi.importActual('@supabase/auth-helpers-react')
    return {
        ...actual,
        useSupabaseClient: () => mockSupabaseClient,
    }
})

const renderWithProviders = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <SessionContextProvider supabaseClient={mockSupabaseClient}>
                {component}
            </SessionContextProvider>
        </BrowserRouter>
    )
}

describe('Auth Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset mock implementations
        mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
        mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: null })
        mockSupabaseClient.auth.signUp.mockResolvedValue({ data: { user: null }, error: null })
    })

    it('renders sign in form by default', () => {
        renderWithProviders(<Auth />)

        expect(screen.getByRole('tab', { name: 'Giriş Yap' })).toBeInTheDocument()
        expect(screen.getByLabelText('E-posta')).toBeInTheDocument()
        expect(screen.getByLabelText('Şifre')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Giriş Yap' })).toBeInTheDocument()
    })

    it('switches to sign up form when toggle is clicked', () => {
        renderWithProviders(<Auth />)

        const toggleButton = screen.getByRole('tab', { name: 'Kayıt Ol' })
        fireEvent.click(toggleButton)

        expect(screen.getByRole('tab', { name: 'Kayıt Ol' })).toBeInTheDocument()
    })

    it('shows password visibility toggle', () => {
        renderWithProviders(<Auth />)

        const passwordInput = screen.getByLabelText('Şifre')
        const visibilityToggle = screen.getByRole('button', { name: '' }) // Eye icon button

        expect(passwordInput).toHaveAttribute('type', 'password')
        fireEvent.click(visibilityToggle)
        expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('shows security notice', () => {
        renderWithProviders(<Auth />)

        expect(screen.getByText('Güvenlik')).toBeInTheDocument()
        expect(screen.getByText(/Verileriniz SSL ile şifrelenir/)).toBeInTheDocument()
    })

    it('handles successful sign in', async () => {
        mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        })

        renderWithProviders(<Auth />)

        const emailInput = screen.getByLabelText('E-posta')
        const passwordInput = screen.getByLabelText('Şifre')
        const submitButton = screen.getByRole('button', { name: 'Giriş Yap' })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'Password123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'Password123',
            })
        }, { timeout: 3000 })
    })

    it('handles sign in error', async () => {
        mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
            data: { user: null },
            error: { message: 'Invalid credentials' },
        })

        renderWithProviders(<Auth />)

        const emailInput = screen.getByLabelText('E-posta')
        const passwordInput = screen.getByLabelText('Şifre')
        const submitButton = screen.getByRole('button', { name: 'Giriş Yap' })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'Password123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument()
        }, { timeout: 3000 })
    })
})
