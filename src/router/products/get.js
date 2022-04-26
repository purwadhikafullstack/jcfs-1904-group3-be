const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const getProductsByCategory = async (keyWord, limit, offset, order, sortBy) => {
  try {
    const connection = await pool.promise().getConnection();
    const sqlGetTotalData = `SELECT count(distinct p.id) as total FROM products as p
    JOIN variant as v ON v.productId = p.id
    Where p.id IN(SELECT distinct p.id FROM products as p
    JOIN categories_products as c_p ON c_p.productId = p.id 
    JOIN categories as c ON c.id = c_p.categoryId 
    WHERE c.categoryName LIKE ?
    ORDER by p.id);`;
    var getProductsByCategory = `SELECT p.id AS productId,
    p.productName,
    v.warehouseId,
    v.id As variantId,
    v.color as variant,
    v.size,
    v.price,
    v.image,
    v.qtyAvailable,
    v.qtyTotal FROM products as p
    JOIN variant as v ON v.productId = p.id
    Where p.id IN(SELECT distinct p.id FROM products as p
    JOIN categories_products as c_p ON c_p.productId = p.id 
    JOIN categories as c ON c.id = c_p.categoryId 
    WHERE c.categoryName LIKE ?
    ORDER by p.id)
    GROUP BY p.id `;
    if (sortBy && order) {
      getProductsByCategory += `ORDER BY ${sortBy} ${order} LIMIT ${limit} OFFSET ${offset};`;
    } else {
      getProductsByCategory += `LIMIT ${limit} OFFSET ${offset};`;
    }

    const data = keyWord;
    const [dataCount] = await connection.query(sqlGetTotalData, keyWord);
    const [result] = await connection.query(getProductsByCategory, data);
    return { dataCount, result };
  } catch (error) {
    throw error;
  }
};

const getFilteredProduct = router.get("/filtered", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const { page, itemsPerPage, order, sortBy } = req.query;
    const limit = parseInt(itemsPerPage);
    const offset = parseInt((page - 1) * itemsPerPage);

    if (req.query.search) {
      // ada category merah ga ?
      // kalau ada baru run ini
      const keyWord = req.query.search;

      const sqlCheckCategory = `select id from categories where categoryName LIKE ? ;`;
      const [result] = await connection.query(sqlCheckCategory, keyWord);

      if (result.length) {
        const { result, dataCount } = await getProductsByCategory(
          keyWord,
          limit,
          offset,
          order,
          sortBy
        );

        connection.release();
        res.status(200).send({ result, dataCount });
      }
      if (!result.length) {
        const sqlGetTotalData = `SELECT count( distinct p.id) as total FROM products as p
        JOIN variant as v ON v.productId = p.id
        Where p.productName Like  ? or v.color Like ? or v.size Like ?;`;
        var getProductByKeyword = ` SELECT p.id AS productId,
        p.productName,
        v.warehouseId,
        v.id As variantId,
        v.color as variant,
        v.size,
        v.price,
        v.image,
        v.qtyAvailable,
        v.qtyTotal FROM products as p
        JOIN variant as v ON v.productId = p.id
        Where p.productName Like ? or v.color Like ? or v.size Like ?
        GROUP BY p.id `;

        if (sortBy && order) {
          getProductByKeyword += `ORDER BY ${sortBy} ${order} LIMIT ${limit} OFFSET ${offset};`;
        } else {
          getProductByKeyword += `LIMIT ${limit} OFFSET ${offset};`;
        }
        const searchKeyword = [keyWord, keyWord, keyWord];
        const data = [keyWord, keyWord, keyWord];
        const [dataCount] = await connection.query(
          sqlGetTotalData,
          searchKeyword
        );
        const [result] = await connection.query(getProductByKeyword, data);
        if (!result.length) {
          res
            .status(400)
            .send({ error: `Cannot find results based on the keyword` });
        }
        connection.release();
        res.status(200).send({ result, dataCount });
      }
    }
    if (req.query.category) {
      const keyWord = req.query.category;

      const { result, dataCount } = await getProductsByCategory(
        keyWord,
        limit,
        offset,
        order,
        sortBy
      );

      connection.release();
      res.status(200).send({ result, dataCount });
    } else {
      const sqlGetTotalData = `SELECT count(distinct p.id) as total FROM products as p
      JOIN variant as v ON v.productId = p.id;`;
      var sqlGetProductList = `SELECT p.id AS productId,
      p.productName,
      v.warehouseId,
      v.id As variantId,
      v.color as variant,
      v.size,
      v.price,
      v.image,
      v.qtyAvailable,
      v.qtyTotal FROM products as p
      JOIN variant as v ON v.productId = p.id
      GROUP BY p.id `;
      if (sortBy && order) {
        sqlGetProductList += `ORDER BY ${sortBy} ${order} LIMIT ${limit} OFFSET ${offset};`;
      } else {
        sqlGetProductList += `LIMIT ${limit} OFFSET ${offset};`;
      }
      const [dataCount] = await connection.query(sqlGetTotalData);
      const [result] = await connection.query(sqlGetProductList);
      connection.release();

      res.status(200).send({ result, dataCount });
    }
  } catch (error) {
    console.log(error);
  }
});

const getVariantsProducts = router.get("/productDetail", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    if (req.query.page) {
      const { page, itemsPerPage } = req.query;
      const limit = parseInt(itemsPerPage);
      const offset = parseInt((page - 1) * itemsPerPage);
      const sqlGetTotalData = `SELECT count(*) as total FROM products as p
      JOIN variant as v ON v.productId = p.id
      Where p.id = ?;`;
      const sqlGetProductList = `SELECT p.id AS productId,
      p.productName,
      v.warehouseId,
      v.id As variantId,
      v.color as variant,
      v.size,
      v.price,
      v.image,
      v.qtyAvailable,
      v.qtyTotal FROM products as p
      JOIN variant as v ON v.productId = p.id
      Where p.id = ?
      LIMIT ? OFFSET ?;`;

      const { id } = req.query;
      const data = [id, limit, offset];
      const [dataCount] = await connection.query(sqlGetTotalData, id);
      const [result] = await connection.query(sqlGetProductList, data);
      connection.release();

      res.status(200).send({ result, dataCount });
    } else {
      const { id } = req.query;
      const productId = id;
      const sqlGetProductList = `SELECT p.id AS productId,
      p.productName,
      v.warehouseId,
      v.id As variantId,
      v.color as variant,
      v.size,
      v.price,
      v.image,
      v.qtyAvailable,
      v.qtyTotal FROM products as p
      JOIN variant as v ON v.productId = p.id
      Where p.id = ?;`;

      const [result] = await connection.query(sqlGetProductList, productId);
      connection.release();

      res.status(200).send({ result });
    }
  } catch (error) {
    console.log(error);
  }
});

const getProductsCategory = router.get("/category", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const sqlGetProductCategory = ` SELECT p.id As productId , c.id As categoryId , c.categoryName FROM products as p
    JOIN categories_products as c_p ON c_p.productId = p.id 
    JOIN categories as c ON c.id = c_p.categoryId WHERE p.id = ?;`;
    const { id } = req.query;
    const [result] = await connection.query(sqlGetProductCategory, id);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

const getProducts = router.get("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const sqlGetProducts = `select id as productId, productName from products;`;

    const [result] = await connection.query(sqlGetProducts);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  getFilteredProduct,
  getVariantsProducts,
  getProductsCategory,
  getProducts,
};
