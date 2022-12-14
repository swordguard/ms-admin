import {useState, useEffect, useId} from 'react';
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FEEDBACK_ENDPOINT } from '../constants/constants'
import AppBar from '@mui/material/AppBar';
import HighQualityIcon from '@mui/icons-material/HighQuality';
// import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import { DataGrid} from '@mui/x-data-grid';
import uniqueId from 'lodash/uniqueId'

const useTableStates = () => {
    const [feedbackList, setFeedbackList] = useState([])
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return {
        feedbackList, setFeedbackList,
        openConfirmation, setOpenConfirmation,
        toBeDeleted, setToBeDeleted,
        isLoading, setIsLoading,
        isDeleting, setIsDeleting
    }
}

const fetchList = (setIsLoading, setFeedbackList) => {
    setIsLoading(true)
    axios.get(`${FEEDBACK_ENDPOINT}s`)
    .then(response => {
        if (response.statusText === 'OK') {
            const records = response.data
            if (records.length > 0) {
                setFeedbackList(records)
            }
        }
        setIsLoading(false)
    })
    .catch(() => {
        setIsLoading(false)
    })
  }
  const deleteRecordById = ({setIsDeleting, id, fetchList, setOpenConfirmation}) => {
    console.log(111,  setOpenConfirmation)
    setIsDeleting(true)
    id && axios.delete(`${FEEDBACK_ENDPOINT}/${id}`).then(() => {
        fetchList()
        setOpenConfirmation(false)
        setIsDeleting(false)
    })
  }

  const handleConfirmation = (setOpenConfirmation,setToBeDeleted, id) => {
    setOpenConfirmation(true);
    setToBeDeleted(id)
  };

  const handleClose = (setOpenConfirmation, setToBeDeleted) => {
    setOpenConfirmation(false);
    setToBeDeleted('')
  };

function ListComponent({setLoggedin}) {
  const {
        feedbackList, setFeedbackList,
        openConfirmation, setOpenConfirmation,
        toBeDeleted, setToBeDeleted,
        isLoading, setIsLoading,
        isDeleting, setIsDeleting
    } = useTableStates()
  
  useEffect(() => {
    fetchList()
  }, [])


  return (
    <Grid>
        <AppBar position="relative">
            <Toolbar sx={{textAlign: 'right'}}>
                <HighQualityIcon sx={{ mr: 2 }} />
                <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setLoggedin(false)}
                >
                    Sign Out
                </Button>
                <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                onClick={fetchList}
                >
                    Refresh
                </Button>
            </Toolbar>
        </AppBar>
        {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <CircularProgress />
            </Box> :
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Date time</TableCell>
                    <TableCell align="right">Full Name</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Comments</TableCell>
                    <TableCell align="right">Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {feedbackList.map((row) => (
                    <TableRow
                    key={row.backupId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {new Date(Number(row.backupId.substring(0, row.backupId.indexOf('-')))).toUTCString()}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {`${row.firstName} ${row.lastName}`}
                    </TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.comments}</TableCell>
                    <TableCell align="right"><DeleteIcon onClick={(e) => handleConfirmation(e, row.backupId)}/></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <Dialog
                open={openConfirmation}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete confirmation"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure to delete it?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} disabled={isDeleting}>No</Button>
                <Button onClick={() => deleteRecordById(toBeDeleted)} autoFocus value='Y' disabled={isDeleting}>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
            </TableContainer>
        }
    </Grid>
  );
}


export const TableComponent = ({setLoggedin}) => {

    const {
        feedbackList, setFeedbackList,
        openConfirmation, setOpenConfirmation,
        toBeDeleted, setToBeDeleted,
        isLoading, setIsLoading,
        isDeleting, setIsDeleting
    } = useTableStates()

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 ,valueGetter: () => uniqueId()},
        { field: 'backupId', headerName: 'Time', width: 220,
        valueGetter: (params) =>
        new Date(Number(params.row.backupId.split('-')[0])).toUTCString()
    },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'comments', headerName: 'Comments',width: 400 },
        { field: '#', headerName: 'Action',width: 100, 
        renderCell: (params) => <DeleteIcon onClick={() => handleConfirmation(setOpenConfirmation,setToBeDeleted, params.row.backupId)}/> },
      ];
      
      const fetch = () => fetchList(setIsLoading, setFeedbackList)
      useEffect(() => {
        fetch()
      }, [])

      console.log(222, toBeDeleted)
      const transformedList = feedbackList.map((feed) => {
        const {backupId} = feed
        return {
            ...feed,
            id: backupId,
        }
      })

      return (
        <Box sx={{ height: 400, width: '100%' }}>
            <AppBar position="relative">
            <Toolbar sx={{textAlign: 'right'}}>
                <HighQualityIcon sx={{ mr: 2 }} />
                <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setLoggedin(false)}
                >
                    Sign Out
                </Button>
                <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                onClick={fetch}
                >
                    Refresh
                </Button>
            </Toolbar>
        </AppBar>
        {
            isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <CircularProgress />
            </Box> :
          <DataGrid
            rows={transformedList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            disableSelectionOnClick
          />
        }
          <Dialog
                open={openConfirmation}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete confirmation"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure to delete it?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => handleClose(setOpenConfirmation, setToBeDeleted)} disabled={isDeleting}>No</Button>
                <Button onClick={() => deleteRecordById(
                    {setIsDeleting, id: toBeDeleted, fetchList: fetch, setOpenConfirmation}
                )} autoFocus value='Y' disabled={isDeleting}>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
        </Box>
      );
}
export default ListComponent