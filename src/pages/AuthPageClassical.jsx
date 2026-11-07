import React, { Component } from "react";
import clsx from "clsx";
import { AuthContext } from "../context/AuthContext.jsx";

import "./AuthPageClassical.scss";

export default class AuthPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isRegistering: false,
      name: "",
      email: "",
      password: "",
      error: "",
      isSubmitting: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  toggleRegistration = () => {
    this.setState((previousState) => ({
      isRegistering: !previousState.isRegistering,
      error: "",
    }));
  };

  submit = async (event) => {
    event.preventDefault();

    const { login, register } = this.context;
    const { isRegistering, name, email, password } = this.state;

    this.setState({ isSubmitting: true, error: "" });

    try {
      if (isRegistering) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
    } catch (submitError) {
      this.setState({
        error: submitError.message || "Couldn't authenticate.",
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { isRegistering, name, email, password, error, isSubmitting } =
      this.state;
    const { error: serverError } = this.context || {};

    return (
      <main className="auth-page">
        <p className="auth-page__eyebrow">Gem Notes</p>
        <h1 className="auth-page__heading">
          {isRegistering ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-page__description">
          {isRegistering
            ? "Sign up to keep your notes private and available to you."
            : "Sign in to continue to your notes."}
        </p>
        <form className="auth-page__form" onSubmit={this.submit}>
          {isRegistering && (
            <div className="auth-page__field">
              <label className="auth-page__label" htmlFor="account-name">
                Name
              </label>
              <input
                className="auth-page__input"
                id="account-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={this.handleChange}
                maxLength={100}
                required
              />
            </div>
          )}
          <div className="auth-page__field">
            <label className="auth-page__label" htmlFor="account-email">
              Email
            </label>
            <input
              className="auth-page__input"
              id="account-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="auth-page__field">
            <label className="auth-page__label" htmlFor="account-password">
              Password
            </label>
            <input
              className="auth-page__input"
              id="account-password"
              name="password"
              type="password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              value={password}
              onChange={this.handleChange}
              minLength={8}
              maxLength={128}
              required
            />
          </div>
          <button
            className={clsx("auth-page__submit", {
              "auth-page__submit--submitting": isSubmitting,
            })}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Sign in"}
          </button>
          {(error || serverError) && (
            <p className="auth-page__feedback" role="alert">
              {error || serverError}
            </p>
          )}
        </form>
        <button
          className="auth-page__toggle"
          type="button"
          onClick={this.toggleRegistration}
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "New to Gem Notes? Create an account"}
        </button>
      </main>
    );
  }
}
