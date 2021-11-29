import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import { sortData } from "./Util";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Container from "@material-ui/core/Container";


function QuantityHistoryChart({ id }) {
    const [products, setProducts] = useState([]);

    const options = {
        title: {
        text: "Quantity",
        },
        xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				millisecond: '%H:%M:%S',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%e. %b',
				week: '%e. %b',
				month: '%b \'%y',
				year: '%Y'
			},
			title: {
				text:  'Date'
			},
			tickPixelInterval: 200,
		},
        yAxis: {
			title: {
				text: 'Price',
			}
		},
        tooltip: {
			yDateFormat: '%Y-%m-%d: %H:%M:%S H',
			xDateFormat: '%Y-%m-%d: %H:%M:%S H',
			shared: true
		},
        series: [
        
        {
        name: 'Quantity',
        data: products.map((obj) => {
            return [obj.date.toMillis(), Number(obj.value)];
        }),
        },
    ],
    };
    const getProducts = () => {
    db.collection('quantityHistory').onSnapshot((snapshot) => {
        let tempProducts = [];
        tempProducts = snapshot.docs.map((doc) => {
        return doc.data();
        });
        tempProducts = tempProducts.filter((item) => {
        return item.key === id;
        });

        const sortedData = sortData(tempProducts);

        setProducts(sortedData);
    });
    };

    useEffect(() => {
    getProducts();
    }, []);

    return (
    
    <Container>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </Container>
    );
}

export default QuantityHistoryChart;


