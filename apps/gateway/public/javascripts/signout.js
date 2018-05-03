function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("Google user signed out.");
    window.location = "/";
  });
} 
