"use client"

import Image from "next/image"
import {useState, useEffect} from "react"
import { db } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography, AppBar, Toolbar, IconButton, debounce } from "@mui/material"
import { Add, Remove, Search } from "@mui/icons-material"
import { collection, getDocs, query, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setopen] = useState(false)
  const [itemname, setItemname] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const updateInventory = async () => {
    const snapshot = query(collection(db, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
          name: doc.id,
          ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(db, "inventory"), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(db, "inventory"), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const searchItem = async (searchTerm) => {
    const snapshot = query(collection(db, "inventory"))
    const docs = await getDocs(snapshot)
    const searchResults = []

    docs.forEach((doc) => {
      const data = doc.data()
      const itemName = doc.id.toLowerCase()
      if (itemName.startsWith(searchTerm.toLowerCase())) {
        searchResults.push({
          name: doc.id,
          ...data,
        })
      }
    })

    setInventory(searchResults)
  }

  const handleSearch = debounce((value) => {
    setSearchTerm(value)
    searchItem(value)
  }, 100)

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setopen(true)
  const handleClose = () => setopen(false)

  return (
    <Box width="100vw" height="100vh">
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <IconButton color="inherit" onClick={handleOpen}>
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={4}
        gap={3}
      >
        {/* Search Bar */}
        <Box width="100%" maxWidth={600}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search items..."
            value={searchTerm} 
            onChange={(e) => {
              handleSearch(e.target.value)
            }}
            InputProps={{
              startAdornment: (
                <Search sx={{ marginRight: 1, color: "rgba(0, 0, 0, 0.54)" }} />
              ),
            }}
          />
        </Box>

        {/* Inventory List */}
        <Box
          width="100%"
          maxWidth={800}
          borderRadius={2}
          border="1px solid #ccc"
          overflow="hidden"
        >
          <Stack
            width="100%"
            spacing={1}
            overflow="auto"
            padding={2}
            bgcolor="#fafafa"
            maxHeight="60vh"
          >
            {inventory.length > 0 ? (
              inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#fff"
                  borderRadius={2}
                  boxShadow={1}
                  padding={2}
                  marginBottom={1}
                >
                  <Typography variant="h6" color="textPrimary">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Quantity: {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addItem(name)}
                    >
                      <Add />
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeItem(name)}
                    >
                      <Remove />
                    </Button>
                  </Stack>
                </Box>
              ))
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100px"
              >
                <Typography variant="h6" color="textSecondary">
                  No items found
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          padding={4}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter item name"
              value={itemname}
              onChange={(e) => setItemname(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemname)
                setItemname("")
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}
