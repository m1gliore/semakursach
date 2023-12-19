import {useRouter} from "next/router";
import * as StyledGamePage from "../components/StyledGamePage";
import {Person} from "@mui/icons-material";
import {formatDateString} from "../lib/Game";
import React, {useEffect, useState} from "react";
import {useLocalStorage} from "react-use";
import axios from "axios";

const Reviews = () => {
    const router = useRouter()
    const [reviews, setReviews] = useState([])
    const [newReview, setNewReview] = useState('')
    const [user, setUser] = useLocalStorage("user", "")
    const [isAdmin, setIsAdmin] = useState(false)
    const [idUser,] = useLocalStorage("idUser", 0)

    useEffect(() => {
        if (user !== "") {
            switch (user) {
                case "ROLE_ADMIN":
                    setIsAdmin(true)
                    break
                case "ROLE_USER":
                    setIsAdmin(false)
                    break
                default:
                    break
            }
        }
    }, [])

    useEffect(() => {
        (async () => {
           await axios.get('http://localhost:8080/feedback/getAll')
               .then(res => setReviews(res.data))
        })()
    }, [])

    const reloadPage = () => {
        router.reload()
    }

    const handleReviewChange = (e) => {
        setNewReview(e.target.value)
    }

    const handleAddReview = async () => {
        const requestBody = {
            comment: newReview,
            component: {
                id: 1
            },
            person: {
                id: idUser
            }
        }
        await axios.post('http://localhost:8080/feedback/add', requestBody)
            .then(() => reloadPage())
    }

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/feedback/del?id=${id}`)
            .then(() => reloadPage())
    }

    return (
        <StyledGamePage.ReviewsContainer>
            <StyledGamePage.ReviewsSection>
                <StyledGamePage.ReviewHeading>Отзывы:</StyledGamePage.ReviewHeading>
                <StyledGamePage.ReviewList>
                    {reviews.map((review, index) => (
                        <StyledGamePage.ReviewItem key={index} onClick={() => handleDelete(review.id)}>
                            <StyledGamePage.ReviewContent>
                                <StyledGamePage.ReviewAuthor><Person/> {review.person.username.split("@")[0]}</StyledGamePage.ReviewAuthor>
                                <StyledGamePage.ReviewText>{review.comment}</StyledGamePage.ReviewText>
                            </StyledGamePage.ReviewContent>
                        </StyledGamePage.ReviewItem>
                    ))}
                </StyledGamePage.ReviewList>
                {!isAdmin &&
                    <StyledGamePage.AddReviewForm onSubmit={handleAddReview}>
                        <StyledGamePage.AddReviewTextarea
                            value={newReview}
                            onChange={handleReviewChange}
                            placeholder="Оставьте свой отзыв..."
                        />
                        <StyledGamePage.GameButton type="submit">Добавить отзыв</StyledGamePage.GameButton>
                    </StyledGamePage.AddReviewForm>
                }
            </StyledGamePage.ReviewsSection>
        </StyledGamePage.ReviewsContainer>
    )
}

export default Reviews