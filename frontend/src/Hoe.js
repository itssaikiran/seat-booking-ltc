//changed ranges in giving renderSeats function

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Paper, TextField, Box, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Seat from './Seat';

const Hoe = () => {

  const [HOE, setHoe] = useState({});  //to store and update HOE
  const [managers, setManagers] = useState([]); //to store and update all managers under HOE
  const [selectedManager, setSelectedManager] = useState('');  //to store and update selected manager in drop-down
  const [selectedSeats, setSelectedSeats] = useState([]);   //to store seats while selecting
  const [isSeatsChanging, setIsSeatsChanging] = useState(false); //we cannot select seats when isSeatsChanging is false

  const [openSnackbar, setOpenSnackbar] = useState(false); // to show a small popup when we update table in database with content "Data Updated Successfully"

  /*-------- handleSnackbarClose function is to show & close popup after updating table --------*/
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };


  useEffect(() => {
    getHOEDetails(2);  // Aslo change id in line 82
  }, []);

  /*-------- getHOEDetails function get HOE and Managers details from database --------*/
  const getHOEDetails = async (id) => {
    try {
      const response1 = await axios.get(`http://localhost:8080/getHOEFromTable/${id}`);
      const response2 = await axios.get(`http://localhost:8080/getManagersByHOEIdFromTable/${id}`);

      // console.log('HOE data:', response1.data);
      // console.log("response 2", response2.data);
      // console.log('Managers data:', response2.data);
      // console.log("Selected Manager:", response2.data[0]);

      setHoe(response1.data[0]);
      setManagers(response2.data.map(item => ({ ...item, name: item.first_name + " " + item.last_name })));
      setSelectedManager({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name });

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  /*-------- handleManagerChange function is to change selectedManager --------*/
  const handleManagerChange = (event) => {
    // console.log("event", event.target.value);
    // console.log(managers);
    const filteredList = managers.filter(manager => manager.id === event.target.value);
    setSelectedManager(filteredList[0]);
    setIsSeatsChanging(false);
    setSelectedSeats([]);
  };

  /*-------- handleSeatClick function is to update selectedSeats upon selecting/deselecting a seat --------*/
  const handleSeatClick = (seat) => {
    if (!selectedSeats.includes(seat)) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    }
  };

  /*-------- onClickingUpdateSeats function is to update respective selectedManager seats in database --------*/
  const onClickingUpdateSeats = async () => {
    selectedSeats.sort((a, b) => a - b);
    //console.log(selectedSeats);
    //console.log(typeof (selectedSeats));
    if (selectedManager && selectedSeats.length > 0) {
      try {
        await axios.put(`http://localhost:8080/updateManagerData/${selectedManager.id}`, {
          seats: selectedSeats
        });
        setSelectedSeats([]);
        setIsSeatsChanging(false);
        getHOEDetails(2); // Refresh data
        setOpenSnackbar(true); // Show Snackbar
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please select atleast one seat.");
    }
  };

  /*-------- renderSeats function is to get Seats from Seat component in Seat.js file --------*/
  const renderSeats = () => {
    let seats = [];
    /*ranges.forEach(range => {*/
    for (let i = 1; i <= HOE.total; i++) {
      seats.push(
        <Seat
          totalHoeSeats={HOE.seats}
          managerDetails={selectedManager}
          managersList={managers}
          isSeatsChanging={isSeatsChanging}
          updatableSeats={selectedSeats}
          key={i}
          number={i}
          isSelected={selectedSeats.includes(i)}
          onClick={() => handleSeatClick(i)}
        />
      );
    }//}
    //)
    return seats;
  };

  /*-------- onClickingChangeSeats function enables all selectedManager and available seats and we will able to select those seats --------*/
  const onClickingChangeSeats = () => {
    setIsSeatsChanging(true);
    setSelectedSeats([...selectedSeats, ...selectedManager.seats_array]);
  }

  /*-------- countAllocatedSeats function is to get values to display in table at top --------*/
  const countAllocatedSeats = () => {
    const seats = managers.flatMap(manager => manager.seats_array);
    const filteredSeats = isSeatsChanging ? seats.filter(item => !selectedManager.seats_array.includes(item)) : seats;
    return filteredSeats.length;
  }

  return (
    <div style={{ marginTop: 110, marginBottom: 110, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {managers.length > 0 && <TableContainer component={Paper} sx={{ marginTop: '20px', marginBottom: '40px', width: "80%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Seats Assigned By Admin</TableCell>
              <TableCell>{HOE.seats.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seats Assigned To Managers</TableCell>
              <TableCell>{String(countAllocatedSeats())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seats Available</TableCell>
              <TableCell>{String(HOE.seats.length - countAllocatedSeats())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>}
      <FormControl fullWidth style={{ marginBottom: '20px', width: '300px' }}>
        <InputLabel id="manager-select-label">Select Manager</InputLabel>
        <Select
          labelId="manager-select-label"
          id="manager-select"
          value={selectedManager ? selectedManager.id : ""}
          label="Select Manager"
          onChange={handleManagerChange}
        >
          {managers.map((manager) => (
            <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6" >Seats Layout</Typography>

      <Box display="flex" flexDirection="row" gap={2}>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">Country: {HOE.country}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">State: {HOE.state}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">City: {HOE.city}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">Floor: {HOE.floor}</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} style={{ margin: '20px 20px', width: "90%", display: "flex", justifyContent: "center", height: "400px", overflowY: "auto" }}>
        {selectedManager.length !== 0 && managers.length !== 0 && renderSeats()}
      </Grid>

      <Grid container spacing={5} justifyContent="center" marginBottom={5}>
        <Grid item>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#28a745', display: 'inline-block', marginRight: '5px' }} />
          <Typography variant="body2" display="inline">Seats Available</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#ffc107', display: 'inline-block', marginRight: '5px' }} />
          <Typography sx={{ height: 20 }} variant="body2" display="inline">Manager Seats</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#007bff', display: 'inline-block', marginRight: '5px' }} />
          <Typography sx={{ height: 20 }} variant="body2" display="inline">Selected Seats</Typography>
        </Grid>
        <Grid item>
          <Box sx={{
            width: 20, height: 20, background: '#fd7e14', display: 'inline-block', marginRight: '5px', position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: '50%',
              backgroundColor: '#ffc107'
            }
          }} />
          <Typography variant="body2" display="inline">Allocated Seats</Typography>
        </Grid>
      </Grid>

      {/*<Button variant="contained" color="primary" onClick={allocateSeats}>Allocate Seats</Button> */}
      {!isSeatsChanging &&
        <Button variant="contained" color="primary" onClick={onClickingChangeSeats}>Change Seats for {selectedManager.name}</Button>}
      {isSeatsChanging && <Paper elevation={0} style={{ padding: '20px', marginTop: '20px' }}>
        <TextField
          label="Selected Seats"
          fullWidth
          value={selectedSeats}
          style={{ marginBottom: '25px' }}
          InputProps={{
            readOnly: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={onClickingUpdateSeats}>Update Seats for {selectedManager.name}</Button>
      </Paper>}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Data updated successfully!
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Hoe;

