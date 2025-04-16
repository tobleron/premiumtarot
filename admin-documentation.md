# Premium Tarot Admin Panel Documentation

This document provides comprehensive instructions for using the Premium Tarot admin panel to manage your website.

## Accessing the Admin Panel

The admin panel is accessible at: https://tobleron.github.io/premiumtarot/admin/

## Authentication

The admin panel uses GitHub authentication to ensure secure access:

1. When you first visit the admin panel, you'll be prompted to enter your GitHub Personal Access Token
2. Enter the same token you provided during the website setup
3. The token is stored securely in your browser's local storage
4. You can log out at any time by clicking the "Logout" button in the top navigation

## Order Management

The Orders section allows you to track and update customer orders:

### Viewing Orders

- All orders are displayed in a table with key information
- Use the status filter dropdown to view orders by status (pending, confirmed, shipped, delivered)
- Use the search box to find orders by order number or customer name
- Click the refresh button to update the order list

### Managing Order Status

To update an order's status:

1. Click the eye icon next to the order you want to manage
2. In the order details modal, you'll see:
   - Customer information
   - Shipping details
   - Product list with prices
   - Current order status with visual progress bar
3. Select the new status from the dropdown menu
4. Add any notes that should be visible to the customer
5. Click "Update Status"

The status will be updated and the customer will see the progress on their order tracking page.

### Order Status Definitions

- **Pending**: Order has been placed but not yet confirmed
- **Confirmed**: Order has been verified and is being prepared
- **Shipped**: Order has been sent to the customer
- **Delivered**: Customer has received the order

## Product Management

The Products section allows you to manage your product catalog:

### Viewing Products

- All products are displayed in a table with key information
- Each product shows an image, name, category, price, and stock level

### Adding a New Product

1. Click the "Add Product" button
2. Fill in the product details:
   - Name
   - Category (Tarot Decks, Oracle Decks, Books, Accessories)
   - Price
   - Stock quantity
   - Description (supports Markdown formatting)
3. Upload a product image (recommended size: 800×800 pixels)
4. Click "Save Product"

### Editing a Product

1. Click the edit icon next to the product you want to modify
2. Update the product details as needed
3. Click "Save Product"

### Deleting a Product

1. Click the delete icon next to the product you want to remove
2. Confirm the deletion when prompted

## Blog Management

The Blog section allows you to create and manage blog posts:

### Viewing Blog Posts

- All blog posts are displayed in a table with key information
- Each post shows an image, title, publication date, likes, and comment count

### Creating a New Blog Post

1. Click the "Add Post" button
2. Fill in the post details:
   - Title
   - Content (supports Markdown formatting)
3. Upload a featured image (recommended size: 1200×800 pixels)
4. Click "Publish"

### Editing a Blog Post

1. Click the edit icon next to the post you want to modify
2. Update the post details as needed
3. Click "Publish"

### Deleting a Blog Post

1. Click the delete icon next to the post you want to remove
2. Confirm the deletion when prompted

## Site Settings

The Settings section allows you to configure global website settings:

### Contact Information

- WhatsApp Number: Update your WhatsApp contact number
- Facebook URL: Update your Facebook page URL

### Shipping Settings

- Free Shipping Threshold: Set the minimum order amount for free shipping
- Default Shipping Cost: Set the standard shipping cost for orders below the threshold

## Using Markdown

Both product descriptions and blog posts support Markdown formatting:

### Basic Markdown Guide

```
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

![Image alt text](image-url.jpg)
```

## Data Storage

The admin panel uses two storage mechanisms:

1. **Local Storage**: Order data, product information, blog posts, and settings are stored in your browser's local storage for demonstration purposes
2. **GitHub Integration**: When authenticated with your GitHub token, changes to the website content can be committed directly to your GitHub repository

## Troubleshooting

If you encounter any issues with the admin panel:

1. Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
2. Try clearing your browser cache and local storage
3. Ensure your GitHub token has the correct permissions
4. Check your internet connection

For additional support, please contact the developer through the provided channels.

## Security Considerations

- Your GitHub token grants access to your repository, so keep it secure
- Log out of the admin panel when not in use
- Only access the admin panel from secure devices and networks

## Future Enhancements

The admin panel can be extended with additional features in the future:

- Advanced analytics and reporting
- Customer management
- Inventory alerts
- Email notification integration
- Multi-user admin access with role-based permissions
