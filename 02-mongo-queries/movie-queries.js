db.movies.find(
    {
        "awards.nominations": {
            $gte: 3
        },
        year: {
            $gt: 2010
        }

    },
    {
        title: 1,
        "awards.nominations": 1,
        year: 1
    })