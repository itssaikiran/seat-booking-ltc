import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseurl } from "./utils";

import "./seatAllocationAdmin.css"; // Make sure you have the correct path and name
const initialSeatingState = [
  {
    country: "india",
    state: "telangana",
    city: "hyderabad",
    floor: "5",
    maxSeats: "60",
  },
  {
    country: "india",
    state: "telangana",
    city: "hyderabad",
    floor: "6",
    maxSeats: "100",
  },
  {
    country: "india",
    state: "telangana",
    city: "hyderabad",
    floor: "10",
    maxSeats: "150",
  },
];
const initialBuState = {
  country: "",
  state: "",
  city: "",
  floor: "",
  bu: "",
  maxSeats: 0,
};
const data = [
  {
    bu: "cloud",
    floor: 5,
    capacity: 5,
    manager: "Hima",
    role: 1213,
    seats: [11, 13, 15, 4],
    country: "india",
    state: "telangana",
    city: "hyderabad",
  },
  {
    bu: "service",
    floor: 5,
    capacity: 10,
    manager: "Asish",
    role: 1214,
    seats: [7, 8],
    country: "india",
    state: "telangana",
    city: "hyderabad",
  },
];
const SeatAllocationAdmin = () => {
  const [seats, setSeats] = useState([]);
  const [values, setValues] = React.useState(initialBuState);
  const [allocationData, setData] = React.useState(data);
  const [allocateSeatSecFlag, setAllocateSeatSecFlag] = useState(false);
  const [capacity, setCapacity] = useState(0);
  const [seatEnable, setSeatsEnable] = useState(false);
  const [allocatedSeatsByGlobal, setallocatedSeatsByGlobal] = useState([]);
  const [maxSeats, setMaxSeats] = useState(0);
  const [bus, setBus] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [floorList, setFloors] = useState([]);

  const navigate = useNavigate();
  React.useEffect(() => {
    getBu();
    getConfiguredData();
  }, []);
  React.useEffect(() => {
    copyValues();
    console.log("999999999999");
  }, [maxSeats]);
  const getBu = async () => {
    await axios
      .get(`${baseurl}/getBu`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.map((row, i) => {
            row.colorCode = getRandomColor();
          });
          setBus(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const getConfiguredData = async () => {
    await axios
      .get(`${baseurl}/getAllocatedSetsAdmin`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setallocatedSeatsByGlobal(res.data);
          handleCountries(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCountries = (data) => {
    let countryList = [];

    for (let i = 0; i < data.length; i++) {
      let findItem = countryList.findIndex(
        (coun) => data[i].country == coun.name
      );

      if (findItem == -1) {
        countryList.push({ name: data[i].country });
      }
    }
    console.log(countryList,"countryList")
    setCountries(countryList);
  };
  const handleStates = (data,country) => {
    let stateList = [];

    for (let i = 0; i < data.length; i++) {
      let findItem = stateList.findIndex(
        (coun) =>
          data[i].state == coun.name && data[i].country == country
      );
      console.log(findItem, "state", data[i].country, values.country);

      if (findItem == -1) {
        // console.log(item.country,"9999999")
        stateList.push({ name: data[i].state });
      }
    }
    // console.log(countryList,"565555")

    setStates(stateList);
  };
  const handleCities = (data,state) => {
    let cityList = [];

    for (let i = 0; i < data.length; i++) {
      let findItem = cityList.findIndex(
        (coun) =>
          data[i].city == coun.name &&
          data[i].country == values.country &&
          data[i].state == state
      );
      // console.log(findItem,"33333")
      console.log(
        findItem,
        "city",
        data[i].country,
        values.country,
        "===",
        data[i].state,
        values
      );

      if (findItem == -1) {
        // console.log(item.country,"9999999")
        cityList.push({ name: data[i].city });
      }
    }
    // console.log(countryList,"565555")

    setCities(cityList);
  };
  const handleFloor = (data, city) => {
    let floorList = [];

    for (let i = 0; i < data.length; i++) {
      let findItem = floorList.findIndex(
        (coun) =>
          data[i].floor == coun.name &&
          data[i].country == values.country &&
          data[i].state == values.state &&
          data[i].city == city
      );
      // console.log(findItem,"33333")
      console.log(
        findItem,
        "floor",
        data[i].country,
        values.country,
        "===",
        data[i].state,
        values.state,
        "===",
        data[i].city,
        values.city
      );

      if (findItem == -1) {
        // console.log(item.country,"9999999")
        floorList.push({ name: data[i].floor });
      }
    }
    // console.log(countryList,"565555")

    setFloors(floorList);
  };
  const copyValues = () => {
    let objs = [];
    for (let i = 0; i < maxSeats; i++) {
      let sobj = {
        seatNo: i + 1,
        bu: "",
        country: "",
        floor: "",
        city: "",
        state: "",
        selected: 0,
        status: 0,
      };
      console.log(allocatedSeatsByGlobal, "allocationData", values);
      //   let objs=allocatedSeatsByGlobal.filter((data,i )=> data.seats.includes(i+1) && data.bu==values.bu && data.country==values.country && data.floor==parseInt(values.floor)
      // && data.state==values.state)
      if (allocatedSeatsByGlobal.length > 0) {
        allocatedSeatsByGlobal.map((obj, j) => {
          console.log(obj.seats.includes(i + 1), "66666666");
          if (obj.seats.includes(i + 1)) {
            sobj = {
              selected: parseInt(obj.floor) == parseInt(values.floor) ? 1 : 0,
              bu: obj.bu_id,
              floor: obj.floor,
              city: obj.city,
              state: obj.state,
              seatNo: i + 1,
            };
          }
        });

        console.log(sobj, "sobj");
      }
      objs.push(sobj);
    }
    setSeats(objs);
  };
  const getConfiguredDataByFilter = async (floor) => {
    let queryParams = { ...values, floor };
    console.log(queryParams);
    await axios
      .get(`${baseurl}/getSeatingCapacityAdminByFilter`, {
        params: queryParams,
      })
      .then((res) => {
        if (res.data && res.data.length > 0 && res.data[0].sum) {
          setMaxSeats(res.data[0].sum);
          console.log(res.data[0].sum, "55555555555555s");
        }else{
          setMaxSeats(100);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (event) => {
    if (event.target.name == "country") {
      handleStates(allocationData, event.target.value);
      setValues({
        ...values,
        [event.target.name]: event.target.value,
        state: "",
        city: "",
        floor: 0,
        bu: 0,
        maxSeats: 0,
      });
    }
   else if (event.target.name == "state") {
    console.log(values,"JJJJJJJJJJ")
      handleCities(allocationData, event.target.value);
      setValues({
        ...values,
        [event.target.name]: event.target.value,
        city: "",
        floor: 0,
        bu: 0,
        maxSeats: 0,
      });
    }
    else if (event.target.name == "city") {
      handleFloor(allocationData, event.target.value);
      setValues({
        ...values,
        [event.target.name]: event.target.value,
        floor: 0,
        bu: 0,
        maxSeats: 0,
      });
    }
    else if (event.target.name == "floor") {
      setMaxSeats(0);
      getConfiguredDataByFilter(event.target.value);
      setValues({ ...values, [event.target.name]: event.target.value,bu:0,maxSeats:0 });

    }
   else if (event.target.name == "bu") {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
        maxSeats: 0,
      });
    }
     else {
      setValues({ ...values, [event.target.name]: event.target.value });
    }
  };
  const colorCodeF = (bu, selected) => {
    // console.log(bu,"bu")
    // console.log(bus,"bu")
    let buData = bus.find((buDta) => buDta.id == bu);
    // console.log(buData,"bu")
    let colorCode = "";
    if (buData) {
      colorCode = buData.colorCode;
    }
    colorCode = selected && colorCode ? colorCode : "#d1cdcd";
    console.log(colorCode, "colorCodecolorCode");
    return colorCode;
  };
  const handleSelectSeats = () => {
    setSeatsEnable(true);
    setAllocateSeatSecFlag(false);
    console.log(values, "55555");
  };
  const handleAllocateSets = (copySeats, getUnallocated) => {
    copySeats.map((copyseat, j) => {
      getUnallocated.map((getUnallocat, i) => {
        if (getUnallocat.seatNo == copyseat.seatNo) {
          copyseat.selected = 1;
          copyseat.status = 1;
          copyseat.bu = values.bu;
          copyseat.city = values.city;
          copyseat.state = values.state;
          copyseat.country = values.country;
          copyseat.floor = parseInt(values.floor);
        }
      });
    });
    return copySeats;
  };
  const getDataFromIndex = (copySeats, index, maxSeats) => {
    let getUnallocated = copySeats.filter(
      (seat, seatIndex) =>
        index <= seatIndex &&
        seatIndex < index + parseInt(maxSeats) &&
        !seat.selected
    );
    let getBackUnallocated = copySeats.filter(
      (seat, seatIndex) =>
        seatIndex > index - parseInt(maxSeats) && !seat.selected
    );
    if (
      getUnallocated.length == 1 &&
      getBackUnallocated.length == values.maxSeats
    ) {
      getUnallocated = getBackUnallocated;
    }
    console.log(
      getBackUnallocated,
      "getUnallocated",
      getUnallocated.length,
      parseInt(values.maxSeats)
    );
    return getUnallocated;
  };
  const getDataFromIndexToBack = (copySeats, index, maxSeats) => {
    let getUnallocatedLessSeats = copySeats.filter(
      (seat, seatIndex) =>
        index <= seatIndex && seatIndex < index + parseInt(maxSeats)
    );
    let getBackUnallocated = copySeats.filter(
      (seat, seatIndex) => seatIndex > index - parseInt(maxSeats)
    );
    if (
      getUnallocatedLessSeats.length == 1 &&
      getBackUnallocated.length == values.maxSeats
    ) {
      getUnallocatedLessSeats = getBackUnallocated;
    }
    if (getUnallocatedLessSeats.length > 0) {
      let findSelectedIndex = getUnallocatedLessSeats.findIndex(
        (seat, seatIndex) => seat.selected == 1
      );
      if (findSelectedIndex > -1) {
        getUnallocatedLessSeats = getUnallocatedLessSeats.slice(
          0,
          findSelectedIndex
        );
      }
    }
    console.log(
      getBackUnallocated,
      "getUnallocated",
      getUnallocatedLessSeats.length,
      parseInt(values.maxSeats)
    );
    return getUnallocatedLessSeats;
  };
  const handleSeatAllocation = (e, index) => {
    let maxSeats = values.maxSeats;
    console.log(index + parseInt(maxSeats), "indexindex", index, maxSeats);
    console.log(index - parseInt(maxSeats), "indexindex", index, maxSeats);

    let copySeats = JSON.parse(JSON.stringify(seats));

    let selectedSeats = copySeats.filter(
      (seat) => seat.status == 1 && seat.selected == 1
    );
    console.log(selectedSeats, "selectedSeatsselectedSeats");
    if (selectedSeats.length == 0) {
      let getUnallocated = getDataFromIndex(copySeats, index, maxSeats);
      if (getUnallocated.length == parseInt(values.maxSeats)) {
        copySeats = handleAllocateSets(copySeats, getUnallocated);
      } else {
        console.log("B");
        let getUnallocatedLessSeats = getDataFromIndexToBack(
          copySeats,
          index,
          maxSeats
        );
        copySeats = handleAllocateSets(copySeats, getUnallocatedLessSeats);
      }
    } else if (selectedSeats.length == maxSeats) {
      console.log("c");
      copySeats.map((copyseat, j) => {
        if (copyseat.status == 1 && copyseat.selected == 1) {
          console.log(copyseat);
          copyseat.selected = 0;
          copyseat.status = 0;
          copyseat.bu = "";
          copyseat.city = "";
          copyseat.state = "";
          copyseat.country = "";
          copyseat.floor = "";
        }
      });
      let getUnallocated = getDataFromIndex(copySeats, index, maxSeats);
      if (getUnallocated.length == values.maxSeats) {
        console.log("A");
        copySeats = handleAllocateSets(copySeats, getUnallocated);
      } else {
        console.log("B");
        let getUnallocatedLessSeats = getDataFromIndexToBack(
          copySeats,
          index,
          maxSeats
        );
        copySeats = handleAllocateSets(copySeats, getUnallocatedLessSeats);
      }
    } else if (selectedSeats.length > 0 && selectedSeats.length < maxSeats) {
      let getUnallocated = getDataFromIndex(
        copySeats,
        index,
        maxSeats - selectedSeats.length
      );
      if (getUnallocated.length == values.maxSeats) {
        copySeats = handleAllocateSets(copySeats, getUnallocated);
      } else {
        console.log("B");
        let getUnallocatedLessSeats = getDataFromIndexToBack(
          copySeats,
          index,
          maxSeats - selectedSeats.length
        );
        copySeats = handleAllocateSets(copySeats, getUnallocatedLessSeats);
      }
    }

    setSeats(copySeats);
  };
  const handleAllocation = () => {
    let result = {};
    seats.forEach((obj, index) => {
      if (obj.selected == 1 && obj.status == 1) {
        console.log(values.country, obj.country);
        let key = `${obj.country}-${obj.state}-${obj.city}-${obj.floor}-${obj.bu}`;

        if (result[key]) {
          result[key].seats.push(obj.seatNo);
        } else {
          result[key] = {
            country: values.country,
            state: values.state,
            city: values.city,
            bu: values.bu,
            floor: parseInt(values.floor),
            seats: [obj.seatNo],
          };
        }
      }
    });

    // Convert result object to an array of objects
    let mergedArray = Object.values(result);

    // Output the merged array
    console.log(mergedArray, "111");
    if (mergedArray.length > 0) {
      handleAllocationToHOE(mergedArray[0]);
    }
  };
  const handleAllocationToHOE = async (obj) => {
    await axios
      .post(`${baseurl}/createAllocatedSetsAdmin`, obj)
      .then((res) => {
        console.log(res.data, "hhhhhhhhh");
        if (res.data) {
          // setCapacityList(res.data);
          // getConfiguredData();
          // clearAllocation();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSeatingCapacity = () => {
    navigate("/configureSeatAllocation");
  };

  console.log(countries, "5555");
  return (
    <div className="seatAllocationContainer">
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid item md={12} sx={{ margin: "0% 3%" }}>
          <Box sx={{ textAlign: "right", margin: "1%" }}>
            <Button
              sx={{ marginRight: "10px" }}
              className="primaryBtnColors"
              onClick={handleAllocation}
            >
              Assign to HOE
            </Button>
            <Button
              sx={{ marginRight: "10px" }}
              className="primaryBtnColors"
              onClick={handleSeatingCapacity}
            >
              Configure Seating Capacity
            </Button>
          </Box>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ margin: "0% 3%" }}
          justifyContent={"center"}
        >
          {/* {allocateSeatSecFlag ? ( */}
          <Grid item md={3}>
            <Grid
              sx={{
                boxShadow:
                  "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                padding: "20px 10px",
              }}
            >
              {/* <Box sx={{ minWidth: 120,alignItems:'center',display:'flex',justifyContent:'start',margin:'10px',cursor:'pointer' }} >
             <ChevronLeftRoundedIcon className='backIconCls' onClick={handleBack}/> <h2 className="fontFamily">Allocate Seats</h2>
                
             </Box> */}

              {countries.length > 0 && (
                <Box sx={{ minWidth: 120 }}>
                  <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                    <InputLabel id="demo-simple-select-label">
                      Country
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.country}
                      label="Country"
                      name="country"
                      onChange={handleChange}
                    >
                      {countries.map((country, i) => (
                        <MenuItem value={country.name}>{country.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                  <InputLabel id="demo-simple-select-label">State</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.state}
                    label="State"
                    name="state"
                    onChange={handleChange}
                  >
                    {states.map((state, i) => (
                      <MenuItem value={state.name}>{state.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.city}
                    label="City"
                    name="city"
                    onChange={handleChange}
                  >
                    {cities.map((city, i) => (
                      <MenuItem value={city.name}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                  <InputLabel id="demo-simple-select-label">Floor</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.floor}
                    label="Floor"
                    name="floor"
                    onChange={handleChange}
                  >
                    {floorList.map((floor, i) => (
                      <MenuItem value={floor.name}>{floor.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                  <InputLabel id="demo-simple-select-label">
                    Business Unit
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.bu}
                    label="Business Unit"
                    name="bu"
                    onChange={handleChange}
                  >
                    {bus.map((bu, i) => (
                      <MenuItem value={bu.id}>{bu.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                  {/* <InputLabel id="demo-simple-select-label">No of seats</InputLabel> */}
                  <TextField
                    id="outlined-number"
                    label="Allocation seats"
                    type="number"
                    name="maxSeats"
                    value={values.maxSeats}
                    onChange={handleChange}
                  />
                  {/* <Input id="outlined-basic" variant="outlined"   name='maxSeats' value={values.maxSeats} onChange={handleChange} type="number"/> */}
                </FormControl>
              </Box>
              <Box sx={{ marginTop: "10px" }}>
                <Grid container justifyContent={"end"}>
                  {!values.floor && (
                    <Button
                      sx={{ marginRight: "10px" }}
                      className="primaryBtnColors"
                      onClick={handleSeatingCapacity}
                    >
                      Configure Seating Capacity
                    </Button>
                  )}
                  {values.maxSeats > 0 && (
                    <Button
                      sx={{ mr: 2 }}
                      className="primaryBtnColors"
                      onClick={handleSelectSeats}
                    >
                      Select Seats
                    </Button>
                  )}
                  {/* <Button   sx={{ mr: 2 }} className="secondaryBtnColors" onClick={clearAllocation}>
                  Clear
                </Button>
                <Button   sx={{ mr: 2 }}  className="primaryBtnColors" onClick={handleSubmitAllocation}>
                  Assign to HOE
                </Button> */}
                </Grid>
              </Box>
            </Grid>
          </Grid>
          {/* ) : ( */}
          <Grid item md={9}>
            <Box className="seatAllocationClass">
              <h2 className="fontFamily">Seat Allocation</h2>
              {seats && seats.length > 0
                ? seats.map((row, rowIndex) => (
                    <>
                      <div
                        key={rowIndex}
                        className={`seat fontFamily ${seatEnable ? "" : "disabled-div"}`}
                        style={{ background: colorCodeF(row.bu, row.selected) }}
                        onClick={(e) => handleSeatAllocation(e, rowIndex)}
                      >
                        {values.floor} - {rowIndex+1}
                      </div>
                    </>
                  ))
                : "Please select the filters then you can able to select the srats "}

              {/* <div>
                <div className="legendsSeating">
                  <div
                    className="seat"
                    style={{
                      background: "green",
                      height: "10px",
                      width: "10px",
                    }}
                  >
                    {" "}
                  </div>
                  <div>Cloud </div>
                </div>
                <div className="legendsSeating">
                  <div
                    className="seat"
                    style={{
                      background: "purple",
                      height: "10px",
                      width: "10px",
                    }}
                  >
                    {" "}
                  </div>
                  <div>Service </div>
                </div>
                <div className="legendsSeating">
                  <div
                    className="seat"
                    style={{
                      background: "#d1cdcd",
                      height: "10px",
                      width: "10px",
                    }}
                  >
                    {" "}
                  </div>
                  <div>Unallocated Seats </div>
                </div>
              </div> */}
            </Box>
          </Grid>
          {/* )} */}
        </Grid>
      </Grid>
    </div>
  );
};

export default SeatAllocationAdmin;
