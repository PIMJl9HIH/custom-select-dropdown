// src/api.ts
import axios from "axios";

export const fetchNames = async () => {
  try {
    const response = await axios.get(
      "https://parseapi.back4app.com/classes/Complete_List_Names",
      {
        headers: {
          "X-Parse-Application-Id": "zsSkPsDYTc2hmphLjjs9hz2Q3EXmnSxUyXnouj1I", // Use the correct App ID
          "X-Parse-Master-Key": "4LuCXgPPXXO2sU5cXm6WwpwzaKyZpo3Wpj4G4xXK", // Use the correct Master Key
        },
        params: {
          count: 1,
          limit: 1000,
          keys: "Name",
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching names:", error);
    return [];
  }
};
