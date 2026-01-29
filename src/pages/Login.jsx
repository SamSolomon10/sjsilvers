import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { login, register, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoading, error } = useSelector(state => state.auth);
    const from = location.state?.from?.pathname || '/';

    useEffect(() => { if (user) navigate(from, { replace: true }); }, [user, navigate, from]);
    useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLogin) {
            dispatch(register({ name: formData.name, email: formData.email, password: formData.password }));
        } else {
            dispatch(login({ email: formData.email, password: formData.password }));
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <div className="logo-icon">💎</div>
                        <span className="logo-text">SJSilvers</span>
                    </Link>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" className="form-input" placeholder="Your name"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required={!isLogin} />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" placeholder="Email"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Password"
                                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-footer">
                    {isLogin ? 'No account? ' : 'Have account? '}
                    <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', color: 'var(--gold-primary)' }}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
