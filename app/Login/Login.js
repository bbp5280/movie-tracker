import React, { Component } from 'react';
import { userLogin } from '../API/User';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      disabled: true
    };
  }

  handleLogin(event){
    event.preventDefault();
    userLogin(this.state.email, this.state.password);

  }

  handleChange(field, event){
    this.setState({
      [field]: event.target.value,
      disabled: !this.state.email || !this.state.password
    });
  }

  render() {
    return (
      <form onSubmit={(event) => this.handleLogin(event)}>
        <input
          type='email'
          value={this.state.email}
          onChange={(event) => this.handleChange('email', event)}
          placeholder='Email'
        />
        <input
          type='password'
          value={this.state.password}
          onChange={(event) => this.handleChange('password', event)}
          placeholder='Password'
        />
        <input type='submit' disabled={this.state.disabled} />
      </form>
    );
  }
}
