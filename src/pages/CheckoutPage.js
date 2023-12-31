import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PageHero, AlertOrder } from '../components'
import axios from 'axios'
import { BsFillPersonFill } from 'react-icons/bs'
import { AiFillPhone } from 'react-icons/ai'
import { FaCity } from 'react-icons/fa'
import WilayasData from '../utils/wilayas.json'

const CheckoutPage = () => {
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [selectedWilaya, setSelectedWilaya] = useState('')
  const [selectedCommune, setSelectedCommune] = useState('')
  const [communes, setCommunes] = useState([])
  const [phone, setPhone] = useState('')
  useEffect(() => {
    if (selectedWilaya) {
      setCommunes(WilayasData.filter((data) => data.wilaya === selectedWilaya))
    }
  }, [selectedWilaya])
  const wilayaName = selectedWilaya.includes('-')
    ? selectedWilaya.split('-')[1].trim()
    : selectedWilaya
  const orderItems = JSON.parse(localStorage.getItem('cart'))
  const orderData = {
    orderItems: orderItems.map((item) => ({
      product: item._id,
      quantity: item.amount,

      priceType: item.type,
    })),
    wilaya: selectedWilaya,
    phoneNumber: phone,
  }
  const validateForm = () => {
    return (
      name !== '' &&
      phone !== '' &&
      selectedCommune !== '' &&
      selectedWilaya !== ''
    )
  }
  console.log('checkout', orderItems)

  const order = () => {
    if (!validateForm()) {
      return
    }
    setLoading(true)
    axios
      .post('http://localhost:3000/orders', orderData)
      .then((response) => {
        console.log('order', orderData)
        if (response.status === 201) {
          setOrderSuccess(true)
        }
      })
      .catch((error) => {
        console.log('error')
      })
      .finally(() => {
        setLoading(false)
      })

    setButtonDisabled(true)

    setTimeout(() => {
      setButtonDisabled(false)
    }, 5000)
  }
  if (orderSuccess) {
    return (
      <main>
        <PageHero title='checkout' />
        <AlertOrder />
      </main>
    )
  }

  return (
    <main>
      <PageHero title=' checkout' />
      <Wrapper className='page'>
        <div className='flex'>
          <div
            className='container'
            style={{ marginTop: 50, marginBottom: 50 }}
          >
            <form id='form1' method='post'>
              <div className='row'>
                <h4>Confirm order</h4>
                <div className='input-group input-group-icon'>
                  <input
                    type='text'
                    placeholder='Full Name'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                  <div className='input-icon'>
                    <BsFillPersonFill />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='input-group input-group-icon '>
                  <select
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    value={selectedWilaya}
                    required
                  >
                    <option value='' className='margin'>
                      --Choose your Wilaya--
                    </option>
                    {[...new Set(WilayasData.map((data) => data.wilaya))].map(
                      (wilaya) => (
                        <option key={wilaya} value={wilaya}>
                          {wilaya}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    value={selectedCommune}
                    required
                    disabled={!selectedWilaya}
                  >
                    <option value=''>--Choose your Commune--</option>
                    {communes.map((data) => (
                      <option key={data.code} value={data.commune}>
                        {data.commune}
                      </option>
                    ))}
                  </select>

                  <div className='input-icon'>
                    <FaCity />
                  </div>
                </div>
              </div>

              <div className='input-group input-group-icon'>
                <input
                  type='tel'
                  placeholder='Phone Number'
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  required
                />
                <div className='input-icon'>
                  <AiFillPhone />
                </div>
              </div>
              <button
                form='form1'
                type='submit'
                className='btn'
                disabled={(isButtonDisabled, loading)}
                onClick={order}
              >
                {loading ? 'Loading...' : 'Order'}
              </button>
            </form>
          </div>
          <div
            className='container'
            style={{ marginTop: 50, marginBottom: 50 }}
          >
            <form id='form2' method='post'>
              <div className='row'>
                <h4>Your Cart</h4>
              </div>
              {orderItems &&
                orderItems.map((item, index) => (
                  <div key={index} className='cart-item marginTop'>
                    <h5 className=' marginTop'>
                      Product {index + 1} : {item.name}
                    </h5>{' '}
                    <p>Quantity: {item.amount}</p>
                    <span> Price : {item.price * item.amount} DA</span>
                    <div>
                      Price with delivery : {item.price * item.amount} DA
                    </div>
                  </div>
                ))}
            </form>
          </div>
        </div>
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.div`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  .marginTop {
    margin-top: 20px;
  }
  .flex {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  body {
    padding: 1em;
    /* font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; */
    font-size: 15px;
    color: #b9b9b9;
    background-color: #e3e3e3;
  }
  .margin {
    margin-left: 15px;
  }

  h4 {
    color: var(--clr-primary-9);
    text-align: center;
  }
  input,
  input[type='radio'] + label,
  select option,
  select {
    width: 100%;
    padding: 1em;
    line-height: 1.4;
    background-color: #f9f9f9;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    -webkit-transition: 0.35s ease-in-out;
    -moz-transition: 0.35s ease-in-out;
    -o-transition: 0.35s ease-in-out;
    transition: 0.35s ease-in-out;
    transition: all 0.35s ease-in-out;
  }
  input:focus {
    outline: 0;
    border-color: #bd8200;
  }
  input:focus + .input-icon:after {
    border-right-color: #f0a500;
  }
  input[type='radio'] {
    display: none;
  }
  input[type='radio'] + label,
  select {
    display: inline-block;
    width: 50%;
    text-align: center;
    border-radius: 0;
  }
  input[type='radio'] + label:first-of-type {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  input[type='radio'] + label:last-of-type {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  input[type='radio'] + label i {
    padding-right: 0.4em;
  }
  input[type='radio']:checked + label,
  select {
    height: 3.4em;
    line-height: 2;
  }
  select:first-of-type {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  select:last-of-type {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  select:focus,
  select:active {
    outline: 0;
  }
  select option {
    color: black;
  }
  .input-group {
    margin-bottom: 1em;
    zoom: 1;
  }
  .input-group:before,
  .input-group:after {
    content: '';
    display: table;
  }
  .input-group:after {
    clear: both;
  }
  .input-group-icon {
    position: relative;
  }
  .input-group-icon input {
    padding-left: 4.4em;
  }
  .input-group-icon .input-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 3.4em;
    height: 3.4em;
    line-height: 3.4em;
    text-align: center;
    pointer-events: none;
  }
  .input-group-icon .input-icon:after {
    position: absolute;
    top: 0.6em;
    bottom: 0.6em;
    left: 3.4em;
    display: block;
    border-right: 1px solid #e5e5e5;
    content: '';
    -webkit-transition: 0.35s ease-in-out;
    -moz-transition: 0.35s ease-in-out;
    -o-transition: 0.35s ease-in-out;
    transition: 0.35s ease-in-out;
    transition: all 0.35s ease-in-out;
  }
  .input-group-icon .input-icon i {
    -webkit-transition: 0.35s ease-in-out;
    -moz-transition: 0.35s ease-in-out;
    -o-transition: 0.35s ease-in-out;
    transition: 0.35s ease-in-out;
    transition: all 0.35s ease-in-out;
  }
  .container {
    max-width: 38em;
    padding: 1em 3em 2em 3em;
    margin: 0em auto;
    background-color: #fff;
    border-radius: 4.2px;
    box-shadow: 0px 3px 10px -2px rgba(0, 0, 0, 0.2);
  }
  .row {
    zoom: 1;
  }
  .row:before,
  .row:after {
    content: '';
    display: table;
  }
  .row:after {
    clear: both;
  }
  @media (max-width: 992px) {
    .flex {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`
export default CheckoutPage
