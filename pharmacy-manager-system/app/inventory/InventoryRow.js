

export default function Inventory({name, category, price, quantityInStock, manufacturer, expirationDate, location}) {

    const tableRowStyles = {
        border: 'solid 1px black'
    } 

    const tableItemStyles = {
        border: 'solid 1px black'
    } 

    const viewItemButtonStyles = {
        width: '100%'
    } 

    return (
        <tr style = {tableRowStyles}>
            <td style={tableItemStyles}>{name}</td>
            <td style={tableItemStyles}>{category}</td>
            <td style={tableItemStyles}>{price}</td>
            <td style={tableItemStyles}>{quantityInStock}</td>
            <td style={tableItemStyles}>{manufacturer}</td>
            <td style={tableItemStyles}>{expirationDate}</td>
            <td style={tableItemStyles}>{location}</td>
            <td style={tableItemStyles}>
                <button style={viewItemButtonStyles}>View Item </button>    
            </td>
         </tr>
    )
  }
  