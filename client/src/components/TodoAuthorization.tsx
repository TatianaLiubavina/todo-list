import Todo from "../components/Todo";
import { useEffect, useState, type FormEvent } from "react";
import { authApi } from "../api/authApi";

type AuthErrorState = string | null;

const TodoAuthorization = () => {
  const [token, setToken] = useState<string | null>(null);
  const [checkingToken, setCheckingToken] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorState>(null);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setAuthError(null);
  };

  useEffect(() => {
    const existing = localStorage.getItem("access_token");
    if (!existing) {
      setToken(null);
      setCheckingToken(false);
      return;
    }

    authApi
      .me(existing)
      .then(() => {
        setToken(existing);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setToken(null);
      })
      .finally(() => setCheckingToken(false));
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await authApi.login({
        username: loginUsername,
        password: loginPassword,
      });
      localStorage.setItem("access_token", res.access_token);
      setToken(res.access_token);
    } catch (err: any) {
      setAuthError(err.message || "Ошибка входа");
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      await authApi.register({
        username: registerUsername,
        password: registerPassword,
      });

      const res = await authApi.login({
        username: registerUsername,
        password: registerPassword,
      });
      localStorage.setItem("access_token", res.access_token);
      setToken(res.access_token);
    } catch (err: any) {
      setAuthError(err.message || "Ошибка регистрации");
    }
  };
  if (checkingToken) return <div>Проверка авторизации...</div>;
  if (token)
    return (
      <div>
        <div>
          <button className="button exit" type="button" onClick={handleLogout}>
            Выход
          </button>
        </div>
        <Todo />
      </div>
    );

  return (
    <div className="authorization">
      <h1 className="authorization__title">Список задач</h1>

      {authError && <div className="authorization__error">{authError}</div>}

      <div className="authorization__sections">
        <section className="log">
          <h2>Вход</h2>
          <form onSubmit={handleLogin} className="form">
            <input
              placeholder="username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit" className="button">
              Войти
            </button>
          </form>
        </section>

        <section className="registration">
          <h2>Регистрация</h2>
          <form onSubmit={handleRegister} className="form">
            <input
              placeholder="username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button type="submit" className="button">
              Зарегистрироваться
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default TodoAuthorization;
