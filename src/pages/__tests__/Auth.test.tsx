import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import Auth from '../Auth'

// Mock Supabase client
const mockSupabaseClient = {
    auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
}

// Mock the Supabase client creation
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabaseClient),
}))

const renderWithProviders = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Auth Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders sign in form by default', () => {
        renderWithProviders(<Auth />)

        expect(screen.getByText('Giriş Yap')).toBeInTheDocument()
        expect(screen.getByLabelText('E-posta')).toBeInTheDocument()
        expect(screen.getByLabelText('Şifre')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Giriş Yap' })).toBeInTheDocument()
    })

    it('switches to sign up form when toggle is clicked', () => {
        renderWithProviders(<Auth />)

        const toggleButton = screen.getByText('Hesap oluştur')
        fireEvent.click(toggleButton)

        expect(screen.getByText('Kayıt Ol')).toBeInTheDocument()
        expect(screen.getByLabelText('Ad Soyad')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Kayıt Ol' })).toBeInTheDocument()
    })

    it('shows password visibility toggle', () => {
        renderWithProviders(<Auth />)

        const passwordInput = screen.getByLabelText('Şifre')
        const visibilityToggle = screen.getByRole('button', { name: /göster|gizle/i })

        expect(passwordInput).toHaveAttribute('type', 'password')
        fireEvent.click(visibilityToggle)
        expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('validates email format', async () => {
        renderWithProviders(<Auth />)

        const emailInput = screen.getByLabelText('E-posta')
        const submitButton = screen.getByRole('button', { name: 'Giriş Yap' })

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/Geçerli bir e-posta adresi giriniz/)).toBeInTheDocument()
        })
    })

    it('validates password strength', async () => {
        renderWithProviders(<Auth />)

        const passwordInput = screen.getByLabelText('Şifre')
        const submitButton = screen.getByRole('button', { name: 'Giriş Yap' })

        fireEvent.change(passwordInput, { target: { value: 'weak' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/Şifre en az 8 karakter olmalıdır/)).toBeInTheDocument()
        })
    })

    it('validates name format in sign up', async () => {
        renderWithProviders(<Auth />)

        // Switch to sign up
        const toggleButton = screen.getByText('Hesap oluştur')
        fireEvent.click(toggleButton)

        const nameInput = screen.getByLabelText('Ad Soyad')
        const submitButton = screen.getByRole('button', { name: 'Kayıt Ol' })

        fireEvent.change(nameInput, { target: { value: 'Ahmet123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/İsim sadece harf içerebilir/)).toBeInTheDocument()
        })
    })

    it('shows security notice', () => {
        renderWithProviders(<Auth />)

        expect(screen.getByText(/Güvenlik Uyarısı/)).toBeInTheDocument()
        expect(screen.getByText(/Bu platform güvenlik önlemleri ile korunmaktadır/)).toBeInTheDocument()
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
        })
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
        })
    })
})
