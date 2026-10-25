const simulateArrivalDate = function (shippingMethod) {
  let arrivalDate = new Date();
  if ((shippingMethod.title = "Express")) {
    arrivalDate.setDate(arrivalDate.getDate() + 1); // add 1 day
  } else {
    const shippingMethodHoldingDays = shippingMethod.time.match(/\d/g);

    if (!shippingMethodHoldingDays) {
      return arrivalDate;
    }

    const random =
      Math.random() *
        (Number(shippingMethodHoldingDays[1]) -
          Number(shippingMethodHoldingDays[0])) +
      Number(shippingMethodHoldingDays[1]);

    arrivalDate.setDate(arrivalDate.getDate() + random);
  }

  return arrivalDate;
};

module.exports = simulateArrivalDate;
