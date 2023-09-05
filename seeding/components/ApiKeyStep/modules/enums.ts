enum ErrorCode {
    None = 0,
    EmptyAPIKey = 1,
    InvalidAPIKey = 2,
    NoTournamentsFound = 3,
    SignInRequired = 4,
    NotWhitelisted = 6,
    CookiesDisabled = 10,
    UnKnownError = 100,
    NotEnoughPlayersInProgression = 11
  }
  
  export default ErrorCode;
  