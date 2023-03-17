import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Typography } from "@mui/material";

const UserRecords = ({ isLoggedIn, setIsLoggedIn }) => {
  const [records, setRecords] = useState([]);
  const [credit, setCredit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch("https://arithmetic-calculator.herokuapp.com/api/v1/user/", {
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
        const response = await fetch("https://arithmetic-calculator.herokuapp.com/api/v1/records/", {
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
  }, [isLoggedIn, navigate, setIsLoggedIn]);

  const handleDelete = async (recordId) => {
    try {
      const response = await fetch(
        `https://arithmetic-calculator.herokuapp.com/api/v1/records/${recordId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== recordId)
        );
      } else {
        const data = await response.json();
        console.error("Error deleting record:", data);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "operation_type", headerName: "Operation", width: 200 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "user_balance", headerName: "User Balance", width: 150 },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleDelete(params.id)}>Delete</button>
      ),
    },
  ];
  
  return (
    <div className="container">
      <h2>User Records</h2>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
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
        />
      </div>
    </div>
  );  
};

export default UserRecords;
