'use client'
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Avatar, Box, Breadcrumbs, Typography, Grid, Link, Divider, Stack, Card, CardActionArea, CardMedia, CardContent, Grow, Dialog, DialogTitle, DialogActions, DialogContent, TextField, InputAdornment, Button } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PrimarySearchAppBar from "../../appbar";

type SellerInfo = {
    seller_name: string;
    seller_avatar: string;
}

type Bookdetail = {
    sellerid: string,
    isbn: string,
    name: string,
    condition: string,
    price?: number,
    shippinglocation: string,
    description: string,
    category: string,
    bookpictures: Array<string>,
};

interface ApiResponse {
    sellerinfo: SellerInfo;
    bookinfo: Bookdetail;
}
function ReadItAgain({ params }: { params: { Bookid: string } }) {
    const [books, setBooks] = useState<Bookdetail>({
        sellerid: '',
        isbn: '',
        name: '',
        condition: '',
        price: 0,
        shippinglocation: '',
        description: '',
        category: '',
        bookpictures: [''],
    });
    const [seller, setSeller] = useState<SellerInfo>({
        seller_name: '',
        seller_avatar: '',
    });

    const handleImageClick = (image: React.SetStateAction<string>) => {
        setSelectedImage(image);
    };
    useEffect(() => {
        fetch(`/api/py/books/${params.Bookid}`)
            .then((response) => response.json() as Promise<ApiResponse>)
            .then((data) => {
                setSeller(data.sellerinfo);
                setBooks(data.bookinfo);
                setSelectedImage(data.bookinfo.bookpictures[0]);
            })
            .catch((error) => {
                console.error('Error fetching books:', error);
            });
    }, [params.Bookid]);
    const [selectedImage, setSelectedImage] = useState('');
    return (
        <main className="overflow-x-hidden min-h-screen bg-white flex flex-col">
            <PrimarySearchAppBar></PrimarySearchAppBar>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} className="px-24 mt-4">
                {/* 書本圖廊 */}
                <Grid item xs={12} sm={8} md={4}>
                    <Box sx={{ maxWidth: 345, margin: 'auto' }}>
                        <Card>
                            <CardMedia
                                component="img"
                                className="h-80"
                                image={selectedImage ? "/api/py/img/book/" + selectedImage : ''}
                                alt="Main Book Image"
                            />
                        </Card>
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            {books.bookpictures.map((image, index) => (
                                <Grid item xs={4} key={index}>
                                    <CardActionArea onClick={() => image && handleImageClick(image)}>
                                        <CardMedia
                                            component="img"
                                            height="100"
                                            image={image ? "/api/py/img/book/" + image : ''}
                                            alt={`Book Thumbnail ${index + 1}`}
                                            sx={{
                                                opacity: image === selectedImage ? 0.5 : 1,
                                                border: image === selectedImage ? '2px solid #666' : 'none',
                                                boxShadow: image === selectedImage ? '0px 0px 8px 2px rgba(102, 102, 102, 0.5)' : 'none',
                                                backgroundColor: !image ? '#ddd' : 'inherit',
                                            }}
                                        />
                                    </CardActionArea>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
                {/*右半邊container*/}
                <Grid item xs={12} sm={8} md={8}>
                    {/* 標題*/}
                    <Grid container item spacing={2} justifyContent="space-between" alignItems="flex-end">
                        <Grid item>
                            <Typography variant="h4" className="font-newsfont" gutterBottom>{books.name}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" className="font-newsfont" gutterBottom>{"ISBN " + books.isbn}</Typography>
                        </Grid>
                    </Grid>

                    {/* 分割線 */}
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    {/*頭像+賣家名稱+星星 */}
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} className="mt-4">
                            <Avatar
                                alt={seller.seller_name}
                                src={seller.seller_avatar ? "/api/py/img/avatar/" + seller.seller_avatar : ''}
                                className="h-9 w-9"
                            />
                            <Link
                                variant="h5"
                                href={"/Seller/" + books.sellerid}
                                underline='none'
                                className='font-newsfont pb-0.5 text-black'
                            >{seller.seller_name}</Link>
                        </Stack>
                    </Grid>
                    <Grid item className="min-[0px]:h-16 md:h-32"></Grid>
                    {/* 書本狀況+書本位置+書本分類 */}
                    <Grid container item justifyContent="flex-start">
                        <Breadcrumbs separator="‧" aria-label="breadcrumb">
                        <Typography variant="subtitle1" className="font-newsfont">{books.condition}</Typography>
                        <Typography variant="subtitle1" className="font-newsfont">{books.shippinglocation}</Typography>
                        <Typography variant="subtitle1" className="font-newsfont">{books.category}</Typography>
                        </Breadcrumbs>
                    </Grid>
                    {/*價格+購物車按鈕 */}
                    <Grid container item spacing={2} justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5" className="font-newsfont">{"NT $" + books.price}</Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" startIcon={<AddShoppingCartIcon></AddShoppingCartIcon>}>加入購物車</Button>
                        </Grid>
                    </Grid>
                    
                    {/* 分割線 */}
                    <Grid item xs={12} className="mt-5">
                        <Divider />
                    </Grid>
                    {/*書本描述*/}
                    <Grid item xs={12} >
                        <Typography variant="h5" className="font-newsfont" gutterBottom>{books.description}</Typography>
                    </Grid>
                </Grid>
            </Grid>

        </main>
    );
}


export default ReadItAgain;