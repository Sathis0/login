import React, { Component } from 'react';
//import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Button from '@mui/material/Button';
import Seyarkai_Vizhi from './images/Seyarkai_Vizhi.jpg';
import se from './images/se.jpg';
import LoadingButton from '@mui/lab/LoadingButton';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { withRouter } from './withRouter';

const defaultTheme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          // ... other state properties
          showSnackbar: false,
          snackbarSeverity: 'success',
          snackbarMessage: '',
          username: localStorage.getItem('username') || 'John', // Retrieve username from localStorage
          email: localStorage.getItem('email') || '',
          password:localStorage.getItem('password'),
          loading: false,
          showPassword: false,
          isPasswordInputNotEmpty: false,

        };
      }
    
    // constructor(){
    //     super()
    //     // this.handleSubmit=this.handleSubmit.bind(this);
    // }
    handlePasswordVisibilityToggle = () => {
      this.setState((prevState) => ({
        showPassword: !prevState.showPassword,
      }));
    };
    
    handlePasswordInputChange = (event) => {
      const { value } = event.target;
      this.setState({
        isPasswordInputNotEmpty: value.length > 0,
      });
    };
    
    handleSnackbarOpen = (severity, message) => {
        this.setState({
          showSnackbar: true,
          snackbarSeverity: severity,
          snackbarMessage: message,
        });
      };
    
      handleSnackbarClose = () => {
        this.setState({ showSnackbar: false });
      };

      handleSubmit = async (event) => {
        event.preventDefault();
        
      
        const formData = {
          email: event.currentTarget.email.value,
          password: event.currentTarget.password.value
        };
      
        if (!formData.email || !formData.password) {
          this.setState({ error: 'Please enter both email and password.' });
          return; // Stop further execution
        }
      
        this.setState({ loading: true });

        try {
          const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert to JSON format
          });
      
          if (response.ok) {
      
            const result = await response.json(); // Parse the response JSON
            console.log(result);
            // Store the token, username, email, and login_time in local storage
            localStorage.setItem('token', result.token);
      
            localStorage.setItem('username', result.username);

            localStorage.setItem('email', result.email);            
            this.props.navigate('/fileupload');
          } else {
      
            const backendError = await response.json();
            console.error('Error from backend:', backendError);
      
            this.handleSnackbarOpen('error', 'Login failed. Please check your credentials.');
            this.setState({ error: 'Invalid email or password.' });
          }
        } catch (error) {
          console.error('Error:', error);
          this.handleSnackbarOpen('error', 'An error occurred while logging in.');
          this.setState({ error: 'An error occurred during login.' });
        }finally {
      this.setState({ loading: false });
    }
      };
    
    render() {
        const { showSnackbar, snackbarSeverity, snackbarMessage, loading,showPassword,isPasswordInputNotEmpty} = this.state;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',backgroundColor:"#FBF9F1" }}>
                <Container fixed >
                    <ThemeProvider theme={defaultTheme} >
                        <Grid container component="main" style={{ height: '60vh', borderRadius: '10px',marginLeft:"30%" }}>

                            <CssBaseline />

                            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} style={{ height: '70vh', borderRadius: '10px' }}>
                                <Box
                                    style={{
                                        my: 8,
                                        mx: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: "20px"
                                    }}
                                >

<Typography component="h1" variant="h5" style={{ marginTop: '60px', height: '100px' }}>
<Grid
                    item
                    xs={false}
                    sm={4}
                    md={6}
                    style={{
                        backgroundImage: `url(${se})`,
                        backgroundRepeat: 'no-repeat',
                       
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '3%',
                        height: '2.4%',
                        position: 'absolute',
                        marginLeft: '2.5%',
                        marginTop:"-0.9%"

                    }}
                />
    <Grid
                    item
                    xs={false}
                    sm={4}
                    md={6}
                    style={{
                        backgroundImage: `url(${Seyarkai_Vizhi})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '9.2%',
                        height: '3%',
                        position: 'absolute',
                        marginLeft: '6.3%',
                        marginTop:"-1%"
                        
                    }}
                />
    <Typography style={{ marginTop: "40px",fontSize:"1.1rem",fontWeight: "bold",marginLeft:"16%" }}>Log in with your work email</Typography>
    <Typography variant="body1" color="textSecondary" sx={{fontSize:'0.95rem', fontFamily: 'Poppins, sans-serif',fontWeight: 400,marginTop: "20px"}}>Use your work email to log in to your team workspace.</Typography>

</Typography>

<br />

                                    
                                    <Box component="form" noValidate onSubmit={this.handleSubmit} style={{ mt: 1 }}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="yourname@company.com"
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                        />
                                        <TextField
  margin="normal"
  required
  fullWidth
  name="password"
  label="Enter your password"
  type={showPassword ? 'text' : 'password'}
  id="password"
  autoComplete="current-password"
  onChange={this.handlePasswordInputChange} // Call the input change handler
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {isPasswordInputNotEmpty && (
          <Button
            onClick={this.handlePasswordVisibilityToggle}
            style={{ minWidth: 'unset', padding: 0,color:"#6001FF" }} // Remove button padding
          >
            {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
          </Button>
        )}
      </InputAdornment>
    ),
  }}
/>


                                        <br />
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="remember"
                                                    color="primary"
                                                    style={{ transform: 'scale(0.6)' }}
                                                    iconStyle={{ fontSize: '10px' }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" >
                                                    Remember me
                                                </Typography>
                                            }
                                        /> */}
                                        <br/>
                        
                                        <Link to="/" variant="body2" style={{ fontSize: "0.95rem", color: '#117DF9',marginLeft:"73.3%" }}>
                                            {"Forgot Password"}
                                        </Link>

                                        {/* <Grid container>
                                            <Grid item xs>
                                                <Link href="#" variant="body2" style={{ fontSize: 12, color: '#6001FF' }}>
                                                    Forgot password?
                                                </Link>
                                            </Grid>
                                        </Grid> */}
                                        <br /><br />
                                        <LoadingButton
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            loading={loading}
                                            loadingPosition="end"
                                            sx={{ '& .MuiCircularProgress-svg': { color: "#624DE3" } }}
                                            style={{ mt: 3, mb: 2, fontSize: "1rem", height: '50px', backgroundColor: "#624DE3", color:"#FFFFFF",borderRadius:"10px" }}
                                        >

                                            LOG IN
                                        </LoadingButton>

                                        {/* <Copyright style={{ mt: 5 }} /> */}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* <Grid
                                item
                                xs={false}
                                sm={4}
                                md={4}
                                style={{
                                    backgroundImage: `url(${loginbg})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundColor: (t) =>
                                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '10px'
                                }}
                            /> */}
                        </Grid>
                    </ThemeProvider>
                </Container>
                
                <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
        >
          <Alert
            onClose={this.handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
            </div>
        );
    }
}

export default withRouter(Login);