import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axios';
import {
    PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

const DashboardPage = () => {
    const [ordersByMonth, setOrdersByMonth] = useState([]);
    const [booksPerGenre, setBooksPerGenre] = useState([]);
    const [bookRatings, setBookRatings] = useState([]);
    const [bookPopularity, setBookPopularity] = useState([]);
    const [bookReviews, setBookReviews] = useState([]);
    const [genreRatings, setGenreRatings] = useState([]);
    const [publisherBookCounts, setPublisherBookCounts] = useState([]);
    const [authorBookCounts, setAuthorBookCounts] = useState([]);
    const [genrePopularity, setGenrePopularity] = useState([]);
    const [authorPopularity, setAuthorPopularity] = useState([]);

    useEffect(() => {
        axiosInstance.get('/stats/orders-by-month').then(res => setOrdersByMonth(res.data));
        axiosInstance.get('/stats/books-per-genre').then(res => setBooksPerGenre(res.data));
        axiosInstance.get('/stats/book-ratings').then(res => setBookRatings(res.data));
        axiosInstance.get('/stats/book-popularity').then(res => setBookPopularity(res.data));
        axiosInstance.get('/stats/book-review-counts').then(res => setBookReviews(res.data));
        axiosInstance.get('/stats/genre-ratings').then(res => setGenreRatings(res.data));
        axiosInstance.get('/stats/publisher-book-counts').then(res => setPublisherBookCounts(res.data));
        axiosInstance.get('/stats/author-book-counts').then(res => setAuthorBookCounts(res.data));
        axiosInstance.get('/stats/genre-popularity').then(res => setGenrePopularity(res.data));
        axiosInstance.get('/stats/author-popularity').then(res => setAuthorPopularity(res.data));
    }, []);

    const totalBooks = useMemo(() =>
        booksPerGenre.reduce((acc, curr) => acc + curr.bookCount, 0), [booksPerGenre]);

    const chartGroups = [
        {
            groupTitle: 'Статистика заказов',
            charts: [
                {
                    title: 'Заказы по месяцам',
                    description: 'Количество заказов в каждом месяце',
                    chart: (
                        <BarChart data={ordersByMonth} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalOrders" fill="#8884d8" />
                        </BarChart>
                    )
                },
                {
                    title: 'Популярность книг',
                    description: 'Количество заказов на каждую книгу',
                    chart: (
                        <BarChart data={bookPopularity} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="bookTitle"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orderCount" fill="#ff8042" />
                        </BarChart>
                    )
                },
                {
                    title: 'Популярность жанров',
                    description: 'Количество заказов книг в каждом жанре',
                    chart: (
                        <BarChart data={genrePopularity} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="genreName"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orderCount" fill="#ff8042" />
                        </BarChart>
                    )
                },
                {
                    title: 'Популярность авторов',
                    description: 'Общее количество заказов книг каждого автора',
                    chart: (
                        <BarChart data={authorPopularity} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="author"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orderCount" fill="#8dd1e1" />
                        </BarChart>
                    )
                }
            ]
        },
        {
            groupTitle: 'Книги, жанры, авторы и издательства',
            charts: [
                {
                    title: 'Распределение книг по жанрам',
                    description: 'Количество книг в каждом жанре',
                    chart: (
                        <PieChart>
                            <Tooltip />
                            <Pie
                                data={booksPerGenre}
                                dataKey="bookCount"
                                nameKey="genreName"
                                innerRadius={60}
                                outerRadius={100}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                        {totalBooks.toLocaleString()}
                                                    </tspan>
                                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                        Всего книг
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                                {booksPerGenre.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    )
                },
                {
                    title: 'Книги по авторам',
                    description: 'Количество книг у каждого автора',
                    chart: (
                        <BarChart data={authorBookCounts} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="author"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="bookCount" fill="#a4de6c" />
                        </BarChart>
                    )
                },
                {
                    title: 'Книги по издателям',
                    description: 'Количество книг по издательствам',
                    chart: (
                        <BarChart data={publisherBookCounts} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="publisher"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="bookCount" fill="#ffc658" />
                        </BarChart>
                    )
                }
            ]
        },
        {
            groupTitle: 'Рейтинги и отзывы',
            charts: [
                {
                    title: 'Средняя оценка книг',
                    description: 'Средние значения оценок на основе отзывов',
                    chart: (
                        <BarChart data={bookRatings} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="bookTitle"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Bar dataKey="averageRating" fill="#82ca9d" />
                        </BarChart>
                    )
                },
                {
                    title: 'Рейтинг по жанрам',
                    description: 'Средний рейтинг книг в каждом жанре',
                    chart: (
                        <BarChart data={genreRatings} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="genreName"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Bar dataKey="averageRating" fill="#82ca9d" />
                        </BarChart>
                    )
                },
                {
                    title: 'Отзывы на книги',
                    description: 'Количество отзывов по каждой книге',
                    chart: (
                        <BarChart data={bookReviews} margin={{ top: 10, right: 16, left: 16, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="bookTitle"
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="reviewCount" fill="#ffc658" />
                        </BarChart>
                    )
                }
            ]
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Панель аналитики</h1>
            {chartGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">{group.groupTitle}</h2>
                    <div className="grid grid-cols-2 gap-8">
                        {group.charts.map((card, index) => (
                            <Card key={index} className="flex flex-col w-full">
                                <CardHeader className="pb-2">
                                    <CardTitle>{card.title}</CardTitle>
                                    <CardDescription>{card.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ResponsiveContainer width="100%" height={400}>
                                        {card.chart}
                                    </ResponsiveContainer>
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    Актуальные данные за период
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardPage;