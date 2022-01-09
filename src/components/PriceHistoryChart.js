import React, { useState, useEffect } from "react";
import TableBody from "@material-ui/core/TableBody";
import { db } from "../firebase";
import { sortData } from "./Util";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";

function PriceHistoryChart({ id }) {
    const [products, setProducts] = useState([]);
    const { t } = useTranslation()
    
    const options = {
        title: {
        text: `${t("chart.price")}`,
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
				text:  `${t("chart.date")}`
			},
			tickPixelInterval: 200,
		},
        yAxis: {
			title: {
				text: `${t("chart.price")}`,
			}
		},
        tooltip: {
			yDateFormat: '%Y-%m-%d: %H:%M:%S H',
			xDateFormat: '%Y-%m-%d: %H:%M:%S H',
			shared: true
		},
        series: [{
            name: `${t("chart.price")}`,
            data: products.map((obj) => {
                return [obj.date.toMillis(), Number(obj.value)];
            }),
        }],
    };
    const getProducts = () => {
    db.collection('priceHistory').onSnapshot((snapshot) => {
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
    
    <React.Fragment>
        <TableBody>
        </TableBody>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </React.Fragment>
    );
}

export default PriceHistoryChart;


