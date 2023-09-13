import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { Router } from '@angular/router';
import { ModirectorDetialsComponent } from '../modirector-detials/modirector-detials.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['welcome']);
      return;
    }
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  openGenreDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Name: movie.Genre.Name,
        Description: movie.Genre.Description,
      }
    })
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Name: "Description",
        Description: movie.Description,
      }
    })
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(ModirectorDetialsComponent, {
      data: {
        Name: movie.Director.Name,
        Description: movie.Director.Bio,
        Birth: movie.Director.Birth,
        Death: movie.Director.Death
      }
    })
  }

  isFavorite(id: string): boolean {
    const user = localStorage.getItem('user');
    const favorites = JSON.parse(user!).FavoriteMovies;
    return favorites.includes(id);
  }

  deleteFavoriteMovie(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((resp: any) => {
      console.log(resp)
      let movie = this.movies.find((m: any) => m._id === id).Title;
      this.snackBar.open(`"${movie}" has been removed from your favorites!`,'OK', {
          duration: 2000,
        });
    });
  }

  addFavoriteMovie(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((resp: any) => {
      console.log(resp)
      let movie = this.movies.find((m: any) => m._id === id).Title;
      this.snackBar.open(`"${movie}" has been added to your favorites!`, 'OK', {
        duration: 2000,
      });
    });
  }
}