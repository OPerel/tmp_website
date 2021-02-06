const { API } = process.env;

const createCookieExpiration = (): string => {
  let now = new Date();
  const time = now.getTime();
  const expireTime = time+3600*1000*24*365*10;
  now.setTime(expireTime);
  return now.toUTCString();
};

const createPageHit = async (userId: string): Promise<void> => {
  try {
    const ipJson = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.IP_API_KEY}`);
    const ipData = await ipJson.json();

    try {
      const newPageHitJson = await fetch(`${API}/newPageHit`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          referrer: document.referrer,
          platform: navigator.platform,
          country: ipData.country,
          city: ipData.city,
          IP: ipData.ip_address
        })
      });
      const newPageHotData = await newPageHitJson.json();
      console.log('new page hit created: ', newPageHotData)
    } catch (analyticApiErr) {
      console.warn('error creating page hit: ', analyticApiErr)
    }

  } catch (ipApiErr) {
    console.warn('ip lookup error: ', ipApiErr)
  }
}

window.addEventListener('load', e => {
  const userCookie = document.cookie.split('; ').find(cookie => cookie.includes('OPUserId'));
  if (userCookie) {
    console.log('cookie found: ', userCookie);
    const userId = userCookie.split('=')[1];
    fetch(`${API}/uniqueUser?userId=${userId}`)
      .then(res => res.json())
      .then(res => {
        console.log('api res: ', res);
        // createPageHit with res._id
        createPageHit(res._id);
      });
  } else {
    console.log('cookie not found. creating new unique user.');
    // create new unique user
    fetch(`${API}/newUniqueUser`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // create the cookie with the user's _id 
        document.cookie = `OPUserId=${res._id}; expires=${createCookieExpiration()}`;
        // createPageHit with res._id
        createPageHit(res._id);
      })
      .catch(err => console.log('error creating new user', err));
  }
})