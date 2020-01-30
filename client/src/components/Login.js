import React, {Component} from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  handleInputChange = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('api/authenticate', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(res => {
        if(res.status === 200) {
          this.props.history.push('/');
        } else {
          const error = new Error(res.error)
          throw error;
        }
      })
      .catch(err => {
        console.log(err);
        alert('Error logging in');
      })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login below!</h1>
          <div className='field column is-one-third is-offset-one-third' >
            <div className='control'>
              <input 
                className='input'
                type='email'
                name='email'
                placeholder='enter email'
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
          <div className='field column is-one-third is-offset-one-third' >
            <div className='control'>
              <input 
                className='input'
                type='password'
                name='password'
                placeholder='enter password'
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
            <input className='button is-primary' type='submit' value='Submit' />
      </form>
    );
  }
}

export default Login;