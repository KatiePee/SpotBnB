import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import { fetchSpot } from "../../store/spots";

const DeleteSpotModal = ({ spot }) => {
  console.log('-------spot delte modal------', spot)
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    return dispatch(deleteSpotThunk(spot.id))
      .then(closeModal)
  }
  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from your listings?</p>
      <button onClick={handleDelete}>Yes, delete spot</button>
      <button onClick={closeModal}>No, keep spot</button>
    </div>
  );
}

export default DeleteSpotModal