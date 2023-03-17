import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const NewOperation = ({ isLoggedIn }) => {
  const [operationType, setOperationType] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [credit, setCredit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetch("http://localhost:8000/api/v1/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCredit(data.credit))
        .catch((error) => console.error("Error:", error));
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);

    const urlMap = {
      addition: "/addition/",
      subtraction: "/subtraction/",
      multiplication: "/multiplication/",
      division: "/division/",
      square_root: "/square_root/",
      random_string: "/random_string/",
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/operations${urlMap[operationType]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ value1, value2 }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
        // Subtract from credit based on operation type
        switch (operationType) {
          case "addition":
          case "subtraction":
          case "multiplication":
          case "division":
            setCredit((prevCredit) => prevCredit - 10);
            break;
          case "square_root":
            setCredit((prevCredit) => prevCredit - 20);
            break;
          case "random_string":
            setCredit((prevCredit) => prevCredit - 25);
            break;
          default:
            break;
        }
      } else {
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsCalculating(false);
  };
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        justifyContent="center"
      >
        <Typography variant="h4" gutterBottom>
          New Operation
        </Typography>
        <Typography variant="h6" gutterBottom>
          Credit: ${credit}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel  id="operation-type-label">Operation Type</InputLabel>
            <Select
              labelId="operation-type-label"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              required
            >
              <MenuItem value="addition">Addition $10</MenuItem>
              <MenuItem value="subtraction">Subtraction $10</MenuItem>
              <MenuItem value="multiplication">Multiplication $10</MenuItem>
              <MenuItem value="division">Division $10</MenuItem>
              <MenuItem value="square_root">Square Root $20</MenuItem>
              <MenuItem value="random_string">Random String $25</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" alignItems="center" justifyContent="center">
            {(operationType !== "random_string" && operationType !== '') && (
              <>
                <TextField
                  label="Value 1"
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                {operationType === "addition" && (
                  <Typography variant="h5" mx={1}>
                    +
                  </Typography>
                )}
                {operationType === "subtraction" && (
                  <Typography variant="h5" mx={1}>
                    -
                  </Typography>
                )}
                {operationType === "multiplication" && (
                  <Typography variant="h5" mx={1}>
                    ×
                  </Typography>
                )}
                {operationType === "division" && (
                  <Typography variant="h5" mx={1}>
                    ÷
                  </Typography>
                )}
                {operationType === "square_root" && (
                  <Typography variant="h5" mx={1}>
                    √
                  </Typography>
                )}
              </>
            )}
            {operationType === "addition" ||
            operationType === "subtraction" ||
            operationType === "multiplication" ||
            operationType === "division" ? (
              <TextField
                label="Value 2"
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
            ) : null}
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={
              credit === 0 ||
              (operationType === "addition" && credit < 10) ||
              (operationType === "subtraction" && credit < 10) ||
              (operationType === "multiplication" && credit < 10) ||
              (operationType === "division" && credit < 10) ||
              (operationType === "square_root" && credit < 20) ||
              (operationType === "random_string" && credit < 25) ||
              (operationType === "")
            }
            sx={{
              backgroundColor:
                credit === 0 ||
                (operationType === "addition" && credit < 10) ||
                (operationType === "subtraction" && credit < 10) ||
                (operationType === "multiplication" && credit < 10) ||
                (operationType === "division" && credit < 10) ||
                (operationType === "square_root" && credit < 20) ||
                (operationType === "random_string" && credit < 25)
                  ? "error.main"
                  : "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor:
                  credit === 0 ||
                  (operationType === "addition" && credit < 10) ||
                  (operationType === "subtraction" && credit < 10) ||
                  (operationType === "multiplication" && credit < 10) ||
                  (operationType === "division" && credit < 10) ||
                  (operationType === "square_root" && credit < 20) ||
                  (operationType === "random_string" && credit < 25)
                    ? "error.dark"
                    : "primary.dark",
              },
            }}
          >
            {credit === 0 ||
            (operationType === "addition" && credit < 10) ||
            (operationType === "subtraction" && credit < 10) ||
            (operationType === "multiplication" && credit < 10) ||
            (operationType === "division" && credit < 10) ||
            (operationType === "square_root" && credit < 20) ||
            (operationType === "random_string" && credit < 25)
              ? "No Credit for Request"
              : "Calculate"}
          </Button>
        </form>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop="20px"
        >
          {isCalculating ? (
            <Typography variant="h6" gutterBottom>
              Calculating...
            </Typography>
          ) : result !== null ? (
            <Typography variant="h6" gutterBottom>
              Result: {result}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Container>
  );
};

export default NewOperation;
