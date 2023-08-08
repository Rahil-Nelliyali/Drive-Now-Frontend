import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    closeDialog,
  } from "@material-tailwind/react";
  
export default function LateChargesDialog({ bookingId, onClose }) {
    const [lateCharges, setLateCharges] = useState('');
  
    const handleLateChargesUpdate = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
  
        // API endpoint for updating late return charges
        const response = await instance.put(`/payment/updatebooking/${bookingId}/`, {
          late_return_charges: lateCharges,
        });
  
        // Handle success
        toast.success('Late return charges added successfully');
        onClose(); // Close the dialog
      } catch (error) {
        console.error('could not update late return charges', error);
        console.error('API error response:', error.response);
      }
    };
  
    return (
      <Dialog size="sm" active={true} toggler={onClose}>
        <DialogHeader toggler={onClose}>Add Late Return Charges</DialogHeader>
        <DialogBody>
          <Input
            type="number"
            placeholder="Enter late return charges"
            value={lateCharges}
            onChange={(e) => setLateCharges(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button color="blue" onClick={handleLateChargesUpdate}>
            Update Charges
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
  