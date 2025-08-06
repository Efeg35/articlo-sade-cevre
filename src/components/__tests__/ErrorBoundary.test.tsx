import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'

// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error')
    }
    return <div>Normal component</div>
}

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // Suppress console.error for expected errors
        vi.spyOn(console, 'error').mockImplementation(() => { })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders children when there is no error', () => {
        renderWithRouter(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        )

        expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('renders error UI when there is an error', () => {
        renderWithRouter(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        )

        expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument()
        expect(screen.getByText('Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.')).toBeInTheDocument()
    })

    it('shows reset and home buttons', () => {
        renderWithRouter(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        )

        expect(screen.getByText('Yenile')).toBeInTheDocument()
        expect(screen.getByText('Ana Sayfa')).toBeInTheDocument()
    })

    it('has clickable reset button', () => {
        renderWithRouter(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        )

        const resetButton = screen.getByText('Yenile')
        expect(resetButton).toBeInTheDocument()
        expect(resetButton).not.toBeDisabled()
    })

    it('navigates to home when home button is clicked', () => {
        const mockLocation = { href: '' }
        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true,
        })

        renderWithRouter(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        )

        const homeButton = screen.getByText('Ana Sayfa')
        fireEvent.click(homeButton)

        expect(window.location.href).toBe('/')
    })
})
