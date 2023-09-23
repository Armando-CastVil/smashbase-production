enum ErrorCode {
    None = 0,
    EmptyAPIKey = 1,
    InvalidAPIKey = 2,
    NoTournamentsFound = 3,
    SignInRequired = 4,
    NotWhitelisted = 6
  }
  
  export default ErrorCode;
  