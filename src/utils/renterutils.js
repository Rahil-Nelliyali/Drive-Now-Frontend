// utils.js
export function getRenterDataFromLocalStorage() {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      const renter_id = user?.renter_id;
   
      const renter_is_active = user?.is_active;
      return { renter_id, renter_is_active };
    }
    return { renter_id: null, renter_is_active: false };
  }
  