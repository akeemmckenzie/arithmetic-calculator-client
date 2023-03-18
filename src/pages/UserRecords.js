import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  CircularProgress,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";
import moment from "moment";

const UserRecords = ({ isLoggedIn, setIsLoggedIn }) => {
  const [records, setRecords] = useState([]);
  const [credit, setCredit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${apiUrl}api/v1/user/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setCredit(data?.credit);
          } else {
            console.error("Error fetching user credit:", data);
          }
        } catch (error) {
          console.error("Error fetching user credit:", error);
        }
      };
      fetchUserData();
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch(`${apiUrl}api/v1/records/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data?.results)) {
            setRecords(data.results);
          } else {
            console.error("Error: API response is not an array:", data);
          }
        } else {
          if (data?.code === "token_not_valid") {
            console.error("Token is not valid:", data.detail);
            setIsLoggedIn(false);
            localStorage.removeItem("token");
            navigate("/");
          } else {
            console.error("Error fetching records:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    if (isLoggedIn) {
      fetchRecords();
    }
  }, [isLoggedIn, navigate, setIsLoggedIn, apiUrl]);

  const handleDelete = async (recordId) => {
    setRecordToDelete(recordId);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setRecordToDelete(null);
  };

  const handleModalDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}api/v1/records/${recordToDelete}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== recordToDelete)
        );
        setModalOpen(false);
        setRecordToDelete(null);
      } else {
        const data = await response.json();
        console.error("Error deleting record:", data);
        setModalOpen(true);
        setRecordToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setModalOpen(true);
      setRecordToDelete(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 300,
      renderCell: (params) => (
        <Typography>
          {moment(params.row.date).format("MMM DD, YYYY, h:mm a")}
        </Typography>
      ),
    },
    { field: "operation_type", headerName: "Operation", width: 200 },
    { field: "operation_response", headerName: "Operation Result", width: 200 },
    { field: "amount", headerName: "Amount Spent", width: 150 },
    { field: "user_balance", headerName: "User Balance", width: 150 },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <IconButton
          title="Delete Record"
          onClick={() => handleDelete(params.id)}
          color="error"
        >
          <FaTrashAlt />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="container">
      <h2>User Records</h2>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <Typography variant="body1" fontWeight="bold" mr={1}>
          Credit:
        </Typography>
        {credit !== null ? (
          <Typography variant="body1">{credit}</Typography>
        ) : (
          <CircularProgress size={20} />
        )}
      </div>
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rowHeight={50}
          rows={records}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Delete Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete(archive) this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleModalDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserRecords;
