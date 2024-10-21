async function getGeoInfo(){
  try {
      const response = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=b3c65af8b9154abcbab426b03731af5e", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("location",data)
        return {region: data.state_prov,country:data.country_name};
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while getting user location...!");
    }
}

module.exports = getGeoInfo;