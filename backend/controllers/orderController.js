const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const user = require("../models/user");
const sendEmailUser = require("../utils/sendEmailUser");
const sendEmailadmin = require("../utils/sendEmailadmin");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const base64 = require("base64-js");

exports.newOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const orders = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  const messageAdmin = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          color: #333;
        }
        p {
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <h1>New Order Notification</h1>
      <p>A new order transaction has been processed. Please review and take necessary actions:</p>
      <p>Customer Email: ${req.user.email}</p>
      <p>Thank you!</p>
    </body>
  </html>
`;

  try {
    await sendEmailadmin({
      email: `RapierTechShop@gmail.com`,
      subject: "Order Transaction",
      messageAdmin,
    });
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    success: true,
    orders,
  });
};

exports.getSingleOrder = async (req, res, next) => {
  const orders = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!orders) {
    return res.status(404).json({ message: `No Order found with this ID` });
  }
  res.status(200).json({
    success: true,
    orders,
  });
};

exports.myOrders = async (req, res, next) => {
  // console.log(mongoose.Types.ObjectId(req.user._id))
  const orders = await Order.where({ user: req.user._id }).populate("user");
  console.log(req.user);

  res.status(200).json({
    success: true,
    orders,
  });
  console.log(req.body);
};

exports.allOrders = async (req, res, next) => {
  const orders = await Order.find().populate("user");

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
};

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order Not Found",
    });
  }
  // await order.remove();
  res.status(200).json({
    success: true,
    message: "Order Deleted",
  });
};

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order Not Found",
    });
  }
  // await order.remove();
  res.status(200).json({
    success: true,
    message: "Order Deleted",
  });
};
exports.updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return res
      .status(404)
      .json({ message: `You have already delivered this order` });
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
  });
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: `No Order found with this ID` });
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
};

exports.salesPerMonth = async (req, res, next) => {
  const chartData = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        total: { $sum: "$totalPrice" },
      },
    },

    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                ,
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                " Sept",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id.month"],
            },
          },
        },
      },
    },
    { $sort: { "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: 1,
        total: 1,
      },
    },
  ]);
  if (!chartData) {
    return res.status(404).json({
      message: "error sales per month",
    });
  }

  res.status(200).json({
    success: true,
    chartData,
  });
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === 'Delivered') {
      return res.status(404).json({ message: 'You have already delivered this order' });
    }

    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save(); 
    const pdfBuffer = [];
    const pdfDoc = new PDFDocument();
    
    pdfDoc.font("Helvetica");
    pdfDoc.text("Rapier Tech Shop", { align: "center" });
    pdfDoc.moveDown();
    pdfDoc.text("Your order has been confirmed. Wait for the Delivery within 1 week");
    pdfDoc.moveDown();
    pdfDoc.text("Order Details:", { align: "center" });
    
    order.orderItems.forEach((item) => {
      pdfDoc.text(`Product name: ${item.name}`);
      pdfDoc.text(`Quantity: ${item.quantity}`);
      pdfDoc.text(`Price: ${item.price}`);
      pdfDoc.text(`Total Amount: ${order.totalPrice}`);
      pdfDoc.moveDown();
    });
    
    pdfDoc.on("data", chunk => pdfBuffer.push(chunk));
    pdfDoc.on("end", async () => {
      const pdfData = Buffer.concat(pdfBuffer);
      const pdfBase64 = pdfData.toString("base64");
    

    const messageUser = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #333;
            }
            p {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Transaction Confirmation</h1>
          <p>Your transaction has been Confirmed</p>
          <ul>
            ${order.orderItems
              .map(
                (item) => `
                  <li><strong>Product Name:</strong> ${item.name}</li>
                  <li><strong>Quantity:</strong> ${item.quantity}</li>
                  <li><strong>Price:</strong> ${item.price}</li>
                `
              )
              .join("")}
            <li><strong>Total Price:</strong> ${order.totalPrice}</li>
          </ul>
          <p>Thank you for using our services!</p>
    
          <!-- Download Button -->
          <a href="data:application/pdf;base64,${pdfBase64}" download="order_receipt.pdf">
            <button style="background-color: #4CAF50; /* Green */
              border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;">Download Receipt</button>
          </a>
        </body>
      </html>
    `;
    await sendEmailUser({
      email: req.user.email,
      subject: "Order Transaction",
      messageUser,
    });

    res.status(200).json({
      success: true,
      order
    });
  });
  
  pdfDoc.end();

} catch (error) {
  console.error("Error updating order status and sending email:", error);

  res.status(500).json({
    success: false,
    error: `Internal Server Error: ${error.message}`,
  });
}
};

exports.sumSupplier = async (req, res, next) => {
  try {
    const chartData = await Product.aggregate([
      {
        $lookup: {
          from: "suppliers",
          localField: "seller",
          foreignField: "_id",
          as: "supplier",
        },
      },
      {
        $unwind: "$supplier",
      },
      {
        $group: {
          _id: "$supplier.name",
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    if (!chartData) {
      return res.status(404).json({
        message: "Error fetching chart data",
      });
    }

    res.status(200).json({
      success: true,
      chartData,
    });
    console.log(chartData);
  } catch (error) {
    console.error("Error in Chart1 function:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get sum of orders for each user
exports.getUserOrderSum = async (req, res, next) => {
  try {
    const chartData = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalAmount: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          userName: "$user.name",
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
