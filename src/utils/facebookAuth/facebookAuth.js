import axios from 'axios';

export async function verifyFacebookToken(accessToken, userId) {
  try {
    // Verify token with Facebook
    const response = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    const { data } = response.data;

    // Check if token is valid and belongs to the user
    if (!data.is_valid || data.user_id !== userId) {
      throw new Error('Invalid Facebook token');
    }

    // Get user info from Facebook
    const userInfoResponse = await axios.get(
      `https://graph.facebook.com/${userId}?fields=id,name,email,picture&access_token=${accessToken}`
    );

    return {
      isValid: true,
      userInfo: userInfoResponse.data
    };
  } catch (error) {
    console.error('Facebook token verification failed:', error);
    return {
      isValid: false,
      error: error.message
    };
  }
}

export async function getFacebookUserData(accessToken) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get Facebook user data:', error);
    throw error;
  }
}