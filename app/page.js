'use client'
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, getDocs, getDoc, query, doc, setDoc } from "firebase/firestore";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  bgcolor: '#FFFFFF',
  padding: '20px',
};

const cardStyle = {
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  backgroundColor: '#fff',
  padding: '20px',
  width: '100%',
  maxWidth: '600px',
  textAlign: 'center',
};

const itemBoxStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  bgcolor: '#f8f8f8',
  padding: '10px 20px',
  borderRadius: '8px',
  marginBottom: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={containerStyle}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                background: '#000',
                color: '#fff',
                borderRadius: '50px',
                '&:hover': {
                  background: '#333',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box sx={cardStyle}>
        <Typography variant={'h4'} color={'#333'} marginBottom={'20px'}>
          Inventory Management App
        </Typography>
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              '&.Mui-focused': {
                borderColor: '#000',
                '& fieldset': {
                  borderColor: '#000',
                },
              },
              '&:hover fieldset': {
                borderColor: '#000',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#000',
              '&.Mui-focused': {
                color: '#000',
              },
            },
          }}
        />
        <Stack width="100%" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box key={name} sx={itemBoxStyle}>
              <Typography
                variant={'h6'}
                color={'#333'}
                textAlign={'left'}
                fontWeight={600}
                flexGrow={1}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant={'h6'}
                color={'#333'}
                textAlign={'center'}
                fontWeight={600}
                flexGrow={1}
              >
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => addItem(name)}
                sx={{
                  background: '#000',
                  color: '#fff',
                  borderRadius: '50px',
                  marginRight: 2,
                  '&:hover': {
                    background: '#333',
                  },
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                sx={{
                  background: '#000',
                  color: '#fff',
                  borderRadius: '50px',
                  '&:hover': {
                    background: '#333',
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            background: '#000',
            color: '#fff',
            borderRadius: '50px',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginTop: '20px',
            '&:hover': {
              background: '#333',
            },
          }}
        >
          Add New Item
        </Button>
      </Box>
    </Box>
  );
}