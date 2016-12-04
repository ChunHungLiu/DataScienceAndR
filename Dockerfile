FROM rocker/rstudio
MAINTAINER Wush Wu <wush978@gmail.com>

RUN useradd -ms /bin/bash wush
USER wush
WORKDIR /home/wush
RUN git clone https://github.com/wush978/DataScienceAndR.git -b gh-pages
WORKDIR /home/wush/DataScienceAndR
RUN echo ".libPaths(new = \".lib\")\noptions(repos = c(\"http://wush978.github.io/R\", \"http://mran.revolutionanalytics.com/snapshot/2016-07-01\"))\n" > .Rprofile && \
  mkdir -p .lib
RUN echo "pkg.list <- available.packages(contrib.url(\"http://wush978.github.io/R\"))\nutils::install.packages(rownames(pkg.list), repos = \"http://wush978.github.io/R\")" | R --no-save --no-restore
