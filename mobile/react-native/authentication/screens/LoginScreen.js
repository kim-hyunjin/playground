import { useState, useContext } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { login } from '../utils/auth';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';

function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const loginHandler = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert('Login fail!', 'Please check your email and password or try again later');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay message={'Login'} />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
