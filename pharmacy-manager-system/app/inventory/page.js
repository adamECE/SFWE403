'use client'
import {useEffect, useState} from 'react'
import InventoryRow from './InventoryRow'

export default function Inventory() {

    // not sure how I'm actually gonna store this stuff
    const [inventoryItems, setInventoryItems] = useState([]); 

    // on page load, load all web elements
    useEffect(() => {
      // TODO: Fetch inventory data
    }, []); 

    const inventoryStyles = {
      marign: '10 auto', 
      border:'solid 2px black',
      padding: '20px',
      backgroundColor: '#86BBD8', 
      width: '100%',
      position: 'absolute',
      left: '0px',
    }

    return (
      <div>
        <h1>I am the Inventory page</h1>
        <table style={inventoryStyles}> 
          <tr>
            <th style = {{border: 'solid 2px black'}}>Name</th>
            <th style = {{border: 'solid 2px black'}}>Category</th>
            <th style = {{border: 'solid 2px black'}}>Price</th>
            <th style = {{border: 'solid 2px black'}}>Quantity In Stock</th>
            <th style = {{border: 'solid 2px black'}}>Manufacturer</th>
            <th style = {{border: 'solid 2px black'}}>Expiration Date</th>
            <th style = {{border: 'solid 2px black'}}>Inventory</th>
          </tr>
          <InventoryRow name={'hello'} category={'category'} price={'price'} 
              quantityInStock={'quantityInStock'} manufacturer={'manufacturer'} 
              expirationDate={'expirationDate'} location={'location'}/> 
        </table>
      </div>
    )
  }
  