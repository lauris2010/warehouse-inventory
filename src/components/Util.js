export const sortData = (tempProducts) => {
    const sortedData = [...tempProducts]

    return sortedData.sort ((a,b) => ( a.date > b.date ? 1 : -1))
}