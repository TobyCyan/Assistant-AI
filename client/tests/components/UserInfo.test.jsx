import { render, screen } from '@testing-library/react';
import UserInfo from '../../src/components/NavBar/UserInfo.jsx'; // Adjust path to your component
import {TokenProvider} from "../../src/components/TokenContext/TokenContext.jsx";

describe('UserInfo Component', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    it('renders correctly with logged-in user', async () => {
        const mockToken = 'mockToken';
        const mockUserData = {
            username: 'testuser',
            points: 100,
        };

        // Mock useTokenContext hook values
        vi.mock('useTokenContext', () => ({
            tokenStatus: [mockToken, vi.fn()],
            userInfo: [mockUserData, vi.fn()],
        }));

        render(<UserInfo />, {
            wrapper: TokenProvider,
        });

        // Assert that username and points are displayed
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('100 pts')).toBeInTheDocument();

        // Assert that 'Log Out' button is present
        expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    it('renders correctly with logged-out user', async () => {
        // Mock useTokenContext hook values for logged-out scenario
        vi.mock('useTokenContext', () => ({
            tokenStatus: ['', vi.fn()],
            userInfo: [{}, vi.fn()],
        }));

        render(<UserInfo />, {
            wrapper: TokenProvider,
        });

        // Assert that 'Log In' and 'Sign Up' buttons are present
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('simulates log out correctly', async () => {
        const mockToken = 'mockToken';
        const mockUserData = {
            username: 'testuser',
            points: 100,
        };

        // Mock useTokenContext hook values
        vi.mock('useTokenContext', () => ({
            tokenStatus: [mockToken, vi.fn()],
            userInfo: [mockUserData, vi.fn()],
        }));

        // Mock navigate function from useNavigate
        const mockNavigate = vi.fn();
        vi.mock('react-router-dom', () => ({
            useNavigate: () => mockNavigate,
        }));

        render(<UserInfo />, {
            wrapper: TokenProvider,
        });

        // Simulate clicking 'Log Out' button
        vi.fireEvent.click(screen.getByText('Log Out'));

        // Assert that setToken and setUserData were called
        expect(vi.getMock('setToken')).toHaveBeenCalled();
        expect(vi.getMock('setUserData')).toHaveBeenCalled();

        // Assert that localStorage.removeItem was called
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');

        // Assert that navigate function was called with "/login"
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
})

